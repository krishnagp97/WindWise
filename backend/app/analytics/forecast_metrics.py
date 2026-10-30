import math


def calculate_forecast_metrics(
    comparisons: list[dict]
) -> dict:

    if not comparisons:
        return {
            "matched_records": 0,
            "mae": None,
            "rmse": None,
            "mape": None,
            "mape_records": 0,
            "zero_actual_records": 0
        }

    errors = [
        record["error"]
        for record in comparisons
    ]

    absolute_errors = [
        abs(error)
        for error in errors
    ]

    mae = sum(absolute_errors) / len(absolute_errors)

    rmse = math.sqrt(
        sum(error ** 2 for error in errors) / len(errors)
    )

    # MAPE is undefined when actual generation is zero.
    valid_percentage_errors = [
        abs(record["error"] / record["actual"]) * 100
        for record in comparisons
        if record["actual"] != 0
    ]

    zero_actual_records = sum(
        1 for record in comparisons
        if record["actual"] == 0
    )

    mape = (
        sum(valid_percentage_errors) / len(valid_percentage_errors)
        if valid_percentage_errors
        else None
    )

    return {
        "matched_records": len(comparisons),
        "mae": mae,
        "rmse": rmse,
        "mape": mape,
        "mape_records": len(valid_percentage_errors),
        "zero_actual_records": zero_actual_records
    }