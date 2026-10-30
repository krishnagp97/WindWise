import pytest

from app.analytics.forecast_comparison import (
    compare_forecasts_with_actuals
)


def test_matches_forecast_with_actual():

    forecasts = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1200
        }
    ]

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        }
    ]

    result = compare_forecasts_with_actuals(
        forecasts, actuals
    )

    assert len(result) == 1
    assert result[0]["error"] == 200
    assert result[0]["absolute_error"] == 200


def test_skips_unmatched_forecasts():

    forecasts = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1200
        }
    ]

    result = compare_forecasts_with_actuals(
        forecasts, []
    )

    assert result == []


def test_handles_underforecast():

    forecasts = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 800
        }
    ]

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        }
    ]

    result = compare_forecasts_with_actuals(
        forecasts, actuals
    )

    assert result[0]["error"] == -200


def test_handles_empty_inputs():

    assert compare_forecasts_with_actuals([], []) == []



def test_matches_equivalent_timezone_formats():

    forecasts = [
        {
            "startTime": "2026-01-01T00:00:00+00:00",
            "generation": 1200
        }
    ]

    actuals = [
        {
            "startTime": "2026-01-01T00:00:00Z",
            "generation": 1000
        }
    ]

    result = compare_forecasts_with_actuals(
        forecasts, actuals
    )

    assert len(result) == 1
    assert result[0]["error"] == 200

def test_returns_comparisons_in_chronological_order():

    forecasts = [
        {"startTime": "2026-01-01T02:00:00Z", "generation": 120},
        {"startTime": "2026-01-01T01:00:00Z", "generation": 110}
    ]

    actuals = [
        {"startTime": "2026-01-01T02:00:00Z", "generation": 100},
        {"startTime": "2026-01-01T01:00:00Z", "generation": 100}
    ]

    result = compare_forecasts_with_actuals(forecasts, actuals)

    assert result[0]["startTime"] == "2026-01-01T01:00:00Z"
    assert result[1]["startTime"] == "2026-01-01T02:00:00Z"