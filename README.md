# BTC Price Tracker

**BTC Price Tracker** is a service designed to track the current price of Bitcoin (BTC) in pair with Tether (USDT). The service periodically fetches price data from Binance, applies a commission rate, caches the adjusted price, and provides an API endpoint for retrieving the current price.

---

## Description

- **Fetches BTC/USDT price data from Binance API.**
- **Applies a configurable commission rate to the price.**
- **Caches the computed price for efficient retrieval.**
- **Provides a RESTful API endpoint to get the current price.**
- **Exposes metrics for monitoring.**
- **Implements logging using Pino for streamlined logs.**

---

## Table of Contents

- [Running the Service](#running-the-service)
    - [1. Run with Docker](#1-run-with-docker)
    - [2. Run Locally](#2-run-locally)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Metrics](#metrics)

---

## Running the Service

### 1. Run with Docker

#### Steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/btc-price-tracker.git
   
2. **Build the Docker image:**
   ```bash
   docker build -t btc-price-tracker .
   
3. **Run the Docker container:**
   ```bash
   docker run -d -p 3000:3000  --env-file .env --name btc-price-tracker btc-price-tracker

4. **Verify the service is running:**
   ```bash
   curl http://localhost:3000/api/v1/price

### 2. Run Locally

#### Steps:
1. **Install dependencies:**
   ```bash
   npm install

2. **Start the application:**
    ```bash
   npm run start

3. **Verify the service is running:**
   ```bash
   curl http://localhost:3000/api/v1/price

### Running Tests
1. **Ensure all dependencies are installed:**
    ```bash
   npm install

2. **Run the test:**
    ```bash
   npm run test

## API Endpoints

### Get Current BTC/USDT Price
- **URL**: `/api/price`
- **Method**: `GET`
- **Description**: Returns the current adjusted mid-price of BTC/USDT.

### Response Example:
```json
{
  "price": "10050.1234"
}
```
## Environment Variables

Configure the application using the .env file. Below are the key environment variables:

| Variable        | Description                                     | Default Value           |
|-----------------|-------------------------------------------------|-------------------------|
| APP_PORT        | Port on which the application will run          | 0.0.0.0                 |
| APP_HOST        | Host on which the application will run          | 3000                    |
| COMMISSION_RATE | Commission rate applied to prices               | 0.01                    |
| BINANCE_API_URL | URL of the Binance API                          | https://api.binance.com |
| NODE_ENV        | The environment in which the project is running | -                       |
| LOG_LVL         | The logging level of the system logs            | INFO                    |

## Metrics
Metrics are available at the /metrics endpoint in Prometheus format.
