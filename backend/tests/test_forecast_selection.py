import pytest
from app.analytics.forecast_selection import select_latest_forecasts


def test_selects_latest_forecast_before_cutoff():
    forecasts = [
        {
            "publishTime": "2026-01-10T06:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 8000
        },
        {
            "publishTime": "2026-01-10T09:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 8500
        },
        {
            "publishTime": "2026-01-10T12:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 9000
        }
    ]

    result = select_latest_forecasts(forecasts, cutoff_hour=10)

    assert len(result) == 1
    assert result[0]["generation"] == 8500


def test_excludes_forecasts_published_after_cutoff():
    forecasts = [
        {
            "publishTime": "2026-01-10T12:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 9000
        }
    ]

    result = select_latest_forecasts(forecasts, cutoff_hour=10)

    assert result == []


def test_handles_empty_forecasts():
    result = select_latest_forecasts([], cutoff_hour=10)

    assert result == []


def test_includes_forecast_published_exactly_at_cutoff():
    forecasts = [
        {
            "publishTime": "2026-01-10T10:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 9000
        }
    ]

    result = select_latest_forecasts(forecasts, cutoff_hour=10)

    assert len(result) == 1
    assert result[0]["generation"] == 9000


def test_selects_latest_forecast_for_each_delivery_period():
    forecasts = [
        {
            "publishTime": "2026-01-10T08:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 8000
        },
        {
            "publishTime": "2026-01-10T09:00:00Z",
            "startTime": "2026-01-11T12:00:00Z",
            "generation": 8500
        },
        {
            "publishTime": "2026-01-10T08:00:00Z",
            "startTime": "2026-01-11T13:00:00Z",
            "generation": 7000
        },
        {
            "publishTime": "2026-01-10T09:30:00Z",
            "startTime": "2026-01-11T13:00:00Z",
            "generation": 7500
        }
    ]

    result = select_latest_forecasts(forecasts, cutoff_hour=10)

    selected = {
        record["startTime"].isoformat(): record["generation"]
        for record in result
    }

    assert len(result) == 2
    assert selected["2026-01-11T12:00:00+00:00"] == 8500
    assert selected["2026-01-11T13:00:00+00:00"] == 7500


@pytest.mark.parametrize("cutoff_hour", [-1, 24, 30])
def test_rejects_invalid_cutoff_hour(cutoff_hour):
    with pytest.raises(ValueError):
        select_latest_forecasts([], cutoff_hour=cutoff_hour)