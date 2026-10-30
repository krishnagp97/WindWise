import pytest

from app.analytics.forecast_metrics import calculate_forecast_metrics


def test_calculates_mae_rmse_and_mape():

    comparisons = [
        {"forecast": 110, "actual": 100, "error": 10},
        {"forecast": 80, "actual": 100, "error": -20}
    ]

    result = calculate_forecast_metrics(comparisons)

    assert result["matched_records"] == 2
    assert result["mae"] == 15
    assert result["rmse"] == pytest.approx(15.811388)
    assert result["mape"] == 15
    assert result["mape_records"] == 2


def test_handles_zero_actual_values():

    comparisons = [
        {"forecast": 100, "actual": 0, "error": 100},
        {"forecast": 110, "actual": 100, "error": 10}
    ]

    result = calculate_forecast_metrics(comparisons)

    assert result["matched_records"] == 2
    assert result["mape"] == 10
    assert result["mape_records"] == 1
    assert result["zero_actual_records"] == 1


def test_returns_none_mape_when_all_actuals_are_zero():

    comparisons = [
        {"forecast": 100, "actual": 0, "error": 100}
    ]

    result = calculate_forecast_metrics(comparisons)

    assert result["mape"] is None
    assert result["mape_records"] == 0


def test_handles_empty_comparisons():

    result = calculate_forecast_metrics([])

    assert result["matched_records"] == 0
    assert result["mae"] is None
    assert result["rmse"] is None
    assert result["mape"] is None