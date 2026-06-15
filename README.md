# 📈 Stock Market Analytics Platform (SMAP)

> A production-ready, containerized backend system designed to analyze, rank, and report on daily stock market data. 

Most stock market scripts pull data into Python and use slow `for` loops to calculate metrics. **SMAP is built differently.** It is engineered using a professional N-Tier architecture, offloading the heavy mathematical lifting directly to a containerized PostgreSQL engine for maximum performance.

## ✨ Core Features

* 📊 **High-Performance Analytics:** Calculates market averages, identifies extreme volatility (highest/lowest prices), and tracks maximum trading volumes.
* 🏆 **Native SQL Ranking:** Bypasses slow Python sorting by utilizing enterprise-grade SQL Window Functions (`RANK() OVER`) to instantly rank stocks by price, volume, and daily growth percentages.
* 💾 **Persistent Containerization:** The database runs completely isolated inside Docker. Using explicit Volume Mapping, the data persists safely on the hard drive even if the container is destroyed.
* 📄 **Automated File I/O:** Programmatically generates highly formatted, human-readable executive summaries (`summary.txt`) and master directories (`market_report.txt`).
* 🖥️ **Interactive Terminal GUI:** Features a clean, menu-driven CLI that unpacks complex data dictionaries into perfectly aligned, readable dashboards.

---

## 🏗️ System Architecture

This project strictly adheres to the **Separation of Concerns** principle. The codebase is modular and divided into independent layers:

* **`sql/` (Infrastructure):** Contains the database connection string and the raw SQL queries/table schemas.
* **`models/` (Data Objects):** Python Dataclasses that define the structure of a Stock and a StockPrice.
* **`repositories/` (Data Access Layer):** The only layer allowed to speak to PostgreSQL. Handles all `JOIN`s and data extraction.
* **`services/` (Business Logic):** The brain of the app. Requests data from the repositories, packages it, and executes the file writing logic.
* **`main.py` (Presentation Layer):** The infinite-loop controller that routes user keyboard inputs to the correct services and beautifully formats the output.

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10+
* Docker Desktop installed and running
* `psycopg2` module installed

### 1. Spin up the Infrastructure
Do not use local background services. SMAP relies on a portable Docker environment. Open your terminal in the project root and run:
```bash
docker-compose up -d


## 🚀 Recent Updates (Week 3: Data Analytics Integration)

The platform has been upgraded to support offline, high-performance data analytics using **Pandas**. To protect the production PostgreSQL database from heavy analytical queries, we implemented an ETL (Extract, Transform, Load) pipeline.

### New Features:
* **ETL Extraction Pipeline:** A dedicated script (`etl/export_data.py`) safely extracts raw relational data from the Docker PostgreSQL container and flattens it into a local `stock_export.csv` file.
* **Pandas Analytics Engine:** A decoupled analytics service (`services/pandas_analytics.py`) that reads the CSV into memory to perform high-speed grouping, aggregations, and filtering.
* **Internal Sandboxing:** Included an internal `_marketdata_exploration.py` script for safely testing data shapes and missing values prior to production deployment.

### How to use the Analytics Engine:
1. Ensure your Docker database is running and populated.
2. Run the extraction script from the root directory to generate the CSV:
   `python -m etl.export_data`
3. Launch the main application:
   `python main.py`
4. Select **Option 6** from the menu to view the Advanced Pandas Analytics reports.