import pytest

from app.analytics.actual_aggregation import aggregate_actuals_by_hour


def test_aggregates_two_half_hourly_readings():

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        },
        {
            "startTime": "2026-01-01T00:30:00Z",
            "generation": 1200
        }
    ]

    result = aggregate_actuals_by_hour(actuals)

    assert len(result) == 1
    assert result[0]["startTime"] == "2026-01-01T00:00:00Z"
    assert result[0]["generation"] == 1100
    assert result[0]["half_hourly_records"] == 2


def test_rejects_missing_half_hourly_reading():

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        }
    ]

    with pytest.raises(ValueError):
        aggregate_actuals_by_hour(actuals)


def test_rejects_duplicate_readings():

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        },
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1100
        }
    ]

    with pytest.raises(ValueError):
        aggregate_actuals_by_hour(actuals)


def test_handles_empty_data():

    assert aggregate_actuals_by_hour([]) == []