# WindWise — Wind Forecast Intelligence

**A full-stack analytics dashboard for monitoring UK wind generation forecasts and evaluating forecast accuracy.**

WindWise helps an energy procurement team understand the wind generation forecast available before a day-ahead purchasing decision and evaluate how accurately that forecast predicts actual generation.

<p align="center">

  **Live Application:** https://wind-wise-taupe.vercel.app/

  **Backend API:** https://windwise-api-ty7o.onrender.com/

  **API Documentation:** https://windwise-api-ty7o.onrender.com/docs

</p>

---

## Overview

Wind generation is weather-dependent, which makes it difficult for energy utilities to estimate how much electricity will be available on a future delivery day.

WindWise addresses two key questions:

1. What was the latest wind generation forecast available before the day-ahead decision deadline?
2. How accurately did that forecast predict actual wind generation?

The application analyses Great Britain national wind generation data published by Elexon for **January 2026**.

### Dashboard Features

- **Overview:** Summary of wind generation and forecast information.
- **Forecast Analysis:** Comparison of forecast and actual wind generation, including forecast publication information.
- **Accuracy:** Quantitative evaluation of forecast errors using MAE, RMSE and MAPE.
- **Data Sources:** Information about the source datasets, fields and data processing methodology.

---

## Data Sources

WindWise uses public data from the Elexon BMRS API.

| Dataset | Purpose | Important fields |
|---|---|---|
| FUELHH | Actual wind generation | `startTime`, `generation`, `fuelType` |
| WINDFOR | Wind generation forecasts | `startTime`, `publishTime`, `generation` |

**Actual generation**
- Uses FUELHH records where `fuelType == WIND`.
- Original actual generation resolution is 30 minutes.
- Actual generation is aggregated to hourly values for comparison.

**Forecast generation**
- Uses WINDFOR forecast records.
- `startTime` identifies the delivery period.
- `publishTime` identifies when the forecast was published.
- Multiple forecast versions can exist for the same delivery period.

### Day-ahead Forecast Selection

A forecast published after the purchasing decision cannot be used to evaluate what information was available at decision time.

WindWise therefore applies this selection strategy:

1. Determine the delivery date.
2. Calculate the previous-day decision cut-off.
3. Keep forecast publications available at or before the cut-off.
4. Select the latest eligible forecast for each delivery period.
5. Compare the selected forecast with the corresponding actual generation.

**Pilot assumption:** The current implementation uses a 10:00 UTC cut-off on the previous day. This is an assumption for the pilot and should be validated against the client's actual trading deadline before operational use.

This approach avoids look-ahead bias by excluding forecasts published after the decision cut-off.

---

## Forecast Accuracy Methodology

For each matched delivery period:

`Forecast Error = Forecast Generation - Actual Generation`

A positive error indicates overforecasting, while a negative error indicates underforecasting.

### Evaluation Metrics

| Metric | Meaning |
|---|---|
| MAE | Mean Absolute Error; average absolute forecast error in MW. |
| RMSE | Root Mean Squared Error; penalises larger forecast errors more heavily. |
| MAPE | Mean Absolute Percentage Error; expresses absolute errors as percentages of actual generation. |

MAPE excludes records where actual generation is zero because percentage error is undefined for those records.

Only periods with matching forecast and actual timestamps are included in the accuracy calculations. Unmatched periods are not silently treated as zero.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS 4, CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Data Processing | Pandas, NumPy |
| HTTP Client | HTTPX |
| API Communication | Axios |
| Containerization | Docker, Docker Compose |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Data Provider | Elexon BMRS API |

---

## Architecture

```text
                 Elexon BMRS API
                  /           \
                 /             \
             FUELHH           WINDFOR
           (Actuals)         (Forecasts)
                 \             /
                  \           /
                   Python Backend
                      FastAPI
                         |
             -------------------------
             |           |           |
          Fetching    Forecast     Accuracy
          & Parsing   Selection    Analysis
             |           |           |
             -------------------------
                         |
                     REST API
                         |
                    Axios Client
                         |
                 React + TypeScript
                         |
                 WindWise Dashboard
                         |
               Vercel Frontend
```

The backend handles data retrieval, forecast selection, hourly aggregation and accuracy calculations. The frontend consumes the REST API and presents the results through dashboard pages and charts.

---

## Project Structure

```text
WindWise/
│
├── backend/
│   ├── app/
│   │   ├── analytics/
│   │   │   ├── forecast_selection.py
│   │   │   ├── actual_aggregation.py
│   │   │   ├── forecast_comparison.py
│   │   │   └── forecast_metrics.py
│   │   │
│   │   ├── services/
│   │   │   └── elexon_client.py
│   │   │
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ForecastAnalysis.tsx
│   │   │   ├── Accuracy.tsx
│   │   │   └── DataSources.tsx
│   │   │
│   │   ├── services/
│   │   ├── types/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   └── App.css
│   │
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── compose.yaml
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 22+
- npm
- Docker Desktop and Docker Compose (recommended)

### Option 1: Run with Docker

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd WindWise
```

Build and start both services:

```bash
docker compose up --build
```

Open the application:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger Documentation | http://localhost:8000/docs |
| Health Check | http://localhost:8000/health |

Stop the containers:

```bash
docker compose down
```

### Option 2: Run Without Docker

**Start the backend**

```bash
cd backend

python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload --port 8000
```

**Start the frontend**

Open another terminal:

```bash
cd frontend

npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the Vite development server:

```bash
npm run dev
```

The frontend development server will display its local URL in the terminal.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Backend health check |
| GET | `/api/actuals` | January 2026 actual wind generation information |
| GET | `/api/forecasts` | Forecast information and publication versions |
| GET | `/api/accuracy` | Forecast accuracy metrics and matched comparisons |

Interactive API documentation is available at `/docs`.

---

## Testing

Run backend tests:

```bash
cd backend
pytest
```

Build the frontend:

```bash
cd frontend
npm run build
```

---

## Deployment

WindWise is deployed as two independent services.

| Component | Platform | Deployment |
|---|---|---|
| Frontend | Vercel | https://wind-wise-taupe.vercel.app/ |
| Backend | Render | https://windwise-api-ty7o.onrender.com/ |

The frontend uses the following environment variable:

```env
VITE_API_BASE_URL=https://windwise-api-ty7o.onrender.com
```

The backend exposes the API on port `8000`.

---

## Scope and Limitations

This is a pilot implementation based on the data provided in the assignment.

- Analysis is restricted to January 2026.
- Only national Great Britain wind generation data from Elexon is included.
- Consumer electricity demand is not included.
- Other generation sources are not included.
- Existing market positions are not included.
- The application does not calculate a final electricity procurement quantity.
- The 10:00 UTC decision cut-off is a pilot assumption that requires business validation.

These limitations are important because wind forecast accuracy alone is not sufficient to determine the complete electricity procurement requirement.

---

## AI Tool Disclosure

OpenAI ChatGPT was used as an AI-assisted development tool during the project for implementation guidance, debugging assistance, documentation drafting and code review.

The developer reviewed and tested the application, its data-processing logic, API behaviour and deployment.

---

## Acknowledgements

- [Elexon BMRS API](https://bmrs.elexon.co.uk/api-documentation)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Docker](https://www.docker.com/)
