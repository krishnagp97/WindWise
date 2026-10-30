from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.elexon_client import fetch_fuelhh
from app.services.elexon_client import fetch_windfor
from datetime import datetime, timezone
from collections import Counter
from app.analytics.forecast_selection import select_latest_forecasts
from app.analytics.actual_aggregation import aggregate_actuals_by_hour
from app.analytics.forecast_comparison import compare_forecasts_with_actuals
from app.analytics.forecast_metrics import calculate_forecast_metrics

app = FastAPI(
    title="WindWise API",
    description="GB Wind Generation Forecast Monitoring and Accuracy Analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to WindWise API",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/actuals")
async def get_actuals():
    data = await fetch_fuelhh(
        "2026-01-01T00:00:00Z",
        "2026-02-01T00:00:00Z"
    )

    january_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    february_start = datetime(2026, 2, 1, tzinfo=timezone.utc)

    january_actuals = [
        record
        for record in data
        if january_start <= datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        ) < february_start
    ]

    delivery_times = sorted({
        record["startTime"] for record in january_actuals
    })

    return {
        "dataset": "FUELHH",
        "fuel_type": "WIND",
        "total_records_received": len(data),
        "january_delivery_records": len(january_actuals),
        "unique_half_hourly_periods": len(delivery_times),
        "earliest_delivery": delivery_times[0] if delivery_times else None,
        "latest_delivery": delivery_times[-1] if delivery_times else None,
        "sample": january_actuals[:5]
    }

@app.get("/api/forecasts")
async def get_forecasts():
    data = await fetch_windfor(
        "2025-12-31T00:00:00Z",
        "2026-02-02T00:00:00Z"
    )

    january_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    february_start = datetime(2026, 2, 1, tzinfo=timezone.utc)

    january_forecasts = [
        record
        for record in data
        if january_start <= datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        ) < february_start
    ]

    selected_forecasts = select_latest_forecasts(
        january_forecasts,
        cutoff_hour=10
    )
    delivery_counts = Counter(
    record["startTime"] for record in january_forecasts
    )

    # Group all forecast versions by delivery timestamp.
    delivery_groups = {}

    for record in january_forecasts:
        delivery_groups.setdefault(record["startTime"], []).append(record)

    # Find the delivery period with the most forecast versions.
    most_forecasted_delivery = max(
        delivery_groups,
        key=lambda timestamp: len(delivery_groups[timestamp])
    )

    # Sort its forecast versions by publication time.
    vintages = sorted(
        delivery_groups[most_forecasted_delivery],
        key=lambda record: record["publishTime"]
    )

    pre_delivery_vintages = [
        record
        for record in vintages
        if datetime.fromisoformat(
            record["publishTime"].replace("Z", "+00:00")
        ) <= datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        )
    ]

    post_delivery_vintages = [
        record
        for record in vintages
        if datetime.fromisoformat(
            record["publishTime"].replace("Z", "+00:00")
        ) > datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        )
    ]

    latest_pre_delivery = (
        max(
            pre_delivery_vintages,
            key=lambda record: record["publishTime"]
        )
        if pre_delivery_vintages
        else None
    )

    publish_times = set(
        record["publishTime"] for record in january_forecasts
    )

    return {
        "dataset": "WINDFOR",
        "total_records_received": len(data),
        "january_delivery_records": len(january_forecasts),
        "unique_delivery_periods": len(delivery_counts),
        "unique_publish_times": len(publish_times),
        "max_forecast_versions_per_delivery": max(
            delivery_counts.values(),
            default=0
        ),
        "sample": january_forecasts[:5],
        "most_forecasted_delivery": most_forecasted_delivery,
        "versions_for_selected_delivery": len(vintages),
        "unique_generation_values": len({
            record["generation"] for record in vintages
        }),
        "forecast_history": vintages,
        "pre_delivery_versions": len(pre_delivery_vintages),
        "post_delivery_versions": len(post_delivery_vintages),
        "latest_pre_delivery_forecast": latest_pre_delivery,
        "day_ahead_cutoff_hour_utc": 10,
        "selected_forecast_records": len(selected_forecasts),
        "selected_forecast_sample": selected_forecasts[:5],
    }


@app.get("/api/accuracy")
async def get_accuracy():

    # 1. Fetch forecast data
    forecast_data = await fetch_windfor(
        "2025-12-31T00:00:00Z",
        "2026-02-02T00:00:00Z"
    )

    january_start = datetime(2026, 1, 1, tzinfo=timezone.utc)
    february_start = datetime(2026, 2, 1, tzinfo=timezone.utc)

    january_forecasts = [
        record
        for record in forecast_data
        if january_start <= datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        ) < february_start
    ]

    # 2. Select day-ahead forecasts
    selected_forecasts = select_latest_forecasts(
        january_forecasts,
        cutoff_hour=10
    )

    # 3. Fetch actual generation data
    actual_data = await fetch_fuelhh(
        "2026-01-01T00:00:00Z",
        "2026-02-01T00:00:00Z"
    )

    january_actuals = [
        record
        for record in actual_data
        if january_start <= datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        ) < february_start
    ]

    # 4. Convert half-hourly actuals into hourly actuals
    hourly_actuals = aggregate_actuals_by_hour(
        january_actuals
    )

    # 5. Match forecasts with actuals
    comparisons = compare_forecasts_with_actuals(
        selected_forecasts,
        hourly_actuals
    )

    # 6. Calculate accuracy metrics
    metrics = calculate_forecast_metrics(comparisons)

    return {
        "period": "January 2026",
        "forecast_strategy": "Latest forecast published by 10:00 UTC on the previous day",
        "actual_aggregation": "Average of two half-hourly generation readings",

        "data_coverage": {
            "forecast_versions": len(january_forecasts),
            "selected_forecasts": len(selected_forecasts),
            "half_hourly_actuals": len(january_actuals),
            "hourly_actuals": len(hourly_actuals),
            "matched_records": len(comparisons),
            "unmatched_forecasts": len(selected_forecasts) - len(comparisons),
            "unmatched_actuals": len(hourly_actuals) - len(comparisons)
        },

        "metrics": metrics,

        "sample_comparisons": comparisons[:10]
    }