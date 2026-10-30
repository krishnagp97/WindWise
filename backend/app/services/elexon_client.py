
import httpx

BASE_URL = "https://data.elexon.co.uk/bmrs/api/v1"


async def fetch_fuelhh(start_date: str, end_date: str):
    """
    Fetch half-hourly generation outturn data from Elexon.

    Dates must be ISO 8601 timestamps, for example:
    2026-01-01T00:00:00Z
    """

    url = f"{BASE_URL}/datasets/FUELHH/stream"

    params = {
        "publishDateTimeFrom": start_date,
        "publishDateTimeTo": end_date,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if not isinstance(data, list):
        raise ValueError("Unexpected response format from Elexon")

    # Keep only wind generation records
    wind_records = [
        record
        for record in data
        if record.get("fuelType", "").upper() == "WIND"
    ]

    return wind_records



async def fetch_windfor(start_date: str, end_date: str):
    """
    Fetch wind generation forecast data from Elexon.
    """

    url = f"{BASE_URL}/datasets/WINDFOR/stream"

    params = {
        "publishDateTimeFrom": start_date,
        "publishDateTimeTo": end_date,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if not isinstance(data, list):
        raise ValueError("Unexpected response format from Elexon")

    return data
