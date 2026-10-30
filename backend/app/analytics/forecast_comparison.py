from datetime import datetime, timezone


def normalize_timestamp(timestamp) -> str:
    parsed = datetime.fromisoformat(
        str(timestamp).replace("Z", "+00:00")
    )

    return (
        parsed.astimezone(timezone.utc)
        .isoformat()
        .replace("+00:00", "Z")
    )


def compare_forecasts_with_actuals(
    forecasts: list[dict],
    actuals: list[dict]
) -> list[dict]:

    actual_lookup = {
        normalize_timestamp(record["startTime"]):
            record["generation"]
        for record in actuals
    }

    comparisons = []

    for forecast in forecasts:
        timestamp = normalize_timestamp(forecast["startTime"])

        if timestamp not in actual_lookup:
            continue

        forecast_value = float(forecast["generation"])
        actual_value = float(actual_lookup[timestamp])

        error = forecast_value - actual_value

        comparisons.append({
            "startTime": timestamp,
            "forecast": forecast_value,
            "actual": actual_value,
            "error": error,
            "absolute_error": abs(error)
        })
    comparisons.sort(key=lambda record: record["startTime"])
    return comparisons