# TaxFrontendPortal
Test
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/node-16+-339933?logo=node.js&logoColor=white)
![Build Status](https://img.shields.io/github/actions/workflow/status/pvlakshm/TaxFrontendPortal/tests.yml?branch=main)

A React-based web portal for calculating tax refunds. Part of the **Tax Refund System**, which also includes [TaxBackendService](https://github.com/pvlakshm/TaxBackendService) — the Python/FastAPI microservice that performs the actual calculation.

---

## Overview

`TaxFrontendPortal` provides a browser-based interface where users can enter order details and instantly see their tax refund amount. It communicates with `TaxBackendService` via a single REST API call, keeping all financial computation server-side and leaving the frontend focused purely on user experience.

---

## System Architecture

```
+----------------------+      POST /api/v1/calculate      +----------------------+
|  TaxFrontendPortal   | --------------------------------> |  TaxBackendService   |
|  (React / CRA)       | <-------------------------------- |  (FastAPI / Python)  |
+----------------------+         JSON response             +----------------------+
```

---

## Tech Stack

| Concern       | Technology                          |
|---------------|-------------------------------------|
| Language      | JavaScript (ES6+)                   |
| UI Framework  | React 18                            |
| Bundler       | Create React App (react-scripts 5)  |
| Testing       | React Testing Library + Jest        |
| HTTP          | Fetch API (built-in)                |

---

## Project Structure

```
TaxFrontendPortal/
├── public/               # Static assets and HTML entry point
├── src/                  # React application source
│   ├── App.js            # Root component — form, state, and API call
│   └── App.test.js       # Component tests (React Testing Library)
├── package.json          # Dependencies and scripts
└── .gitignore
```

---

## Prerequisites

- **Node.js** (v16 or later recommended)
- **TaxBackendService** running locally at `http://127.0.0.1:8000`  
  See [TaxBackendService setup instructions](https://github.com/pvlakshm/TaxBackendService#getting-started).

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend

Before running the frontend, make sure the backend service is running:

```bash
# In the TaxBackendService directory:
python -m uvicorn main:app --reload
```

### 3. Start the Frontend

```bash
npm start
```

The portal opens in your browser at `http://localhost:3000`.

---

## Usage

1. Enter the **Refund Amount** (price of the item being returned).
2. Enter the **Total Order Amount** (original full order value).
3. Enter the **Tax Paid** on the order.
4. Submit the form — the portal calls `TaxBackendService` and displays the calculated tax refund.

**Example:**
- Refund Amount: `50`
- Total Amount: `100`
- Tax Paid: `15`
- → **Tax Refund: $7.50**

---

## Running Tests

```bash
npm test
```

Tests use React Testing Library and are run in non-watch mode by default (`--watchAll=false`).

---

## Backend API Dependency

This portal expects `TaxBackendService` to be reachable at:

```
http://127.0.0.1:8000/api/v1/calculate
```

If the backend is deployed to a different host or port, update the API endpoint URL in `src/App.js` accordingly.

**Expected request format:**

```json
{
  "refund_amount": 50,
  "total_amount": 100,
  "tax_paid": 15
}
```

**Expected response format:**

```json
{
  "status": "success",
  "formula_version": "1.0",
  "tax_refund": 7.5
}
```

---

## Related Repositories

- **[TaxBackendService](https://github.com/pvlakshm/TaxBackendService)** — Python/FastAPI microservice that implements the tax refund calculation logic.
