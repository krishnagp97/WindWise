from collections import defaultdict
from datetime import datetime, timezone


def aggregate_actuals_by_hour(
    actuals: list[dict]
) -> list[dict]:

    hourly_groups = defaultdict(dict)

    for record in actuals:
        timestamp = datetime.fromisoformat(
            record["startTime"].replace("Z", "+00:00")
        ).astimezone(timezone.utc)

        hour = timestamp.replace(
            minute=0,
            second=0,
            microsecond=0
        )

        minute = timestamp.minute

        if minute not in (0, 30):
            raise ValueError(
                f"Unexpected half-hour timestamp: {record['startTime']}"
            )

        if minute in hourly_groups[hour]:
            raise ValueError(
                f"Duplicate actual reading: {record['startTime']}"
            )

        hourly_groups[hour][minute] = float(record["generation"])

    hourly_actuals = []

    for hour, readings in sorted(hourly_groups.items()):

        if set(readings.keys()) != {0, 30}:
            raise ValueError(
                f"Incomplete half-hourly data for {hour.isoformat()}"
            )

        average_generation = (
            readings[0] + readings[30]
        ) / 2

        hourly_actuals.append({
            "startTime": hour.isoformat().replace("+00:00", "Z"),
            "generation": average_generation,
            "half_hourly_records": 2
        })

    return hourly_actuals