
import pandas as pd


def select_latest_forecasts(
    forecasts: list[dict],
    cutoff_hour: int = 10
) -> list[dict]:

    if not isinstance(cutoff_hour, int) or isinstance(cutoff_hour, bool):
        raise ValueError("cutoff_hour must be an integer between 0 and 23")

    if not 0 <= cutoff_hour <= 23:
        raise ValueError("cutoff_hour must be between 0 and 23")

    df = pd.DataFrame(forecasts)

    if df.empty:
        return []

    # Convert timestamps to UTC
    df["publishTime"] = pd.to_datetime(
        df["publishTime"], utc=True
    )

    df["startTime"] = pd.to_datetime(
        df["startTime"], utc=True
    )

    # Decision cutoff is one day before delivery
    df["cutoffTime"] = (
        df["startTime"].dt.floor("D")
        - pd.Timedelta(days=1)
        + pd.Timedelta(hours=cutoff_hour)
    )

    # Only forecasts published before the cutoff
    eligible = df[
        df["publishTime"] <= df["cutoffTime"]
    ].copy()

    # Latest eligible forecast for each delivery period
    selected = (
        eligible.sort_values("publishTime")
        .groupby("startTime", as_index=False)
        .tail(1)
    )

    return selected.to_dict(orient="records")
