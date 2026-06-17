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
```


## 🚀 Recent Updates (Week 3: Data Analytics Integration)

The platform has been heavily upgraded to feature a complete **ETL (Extract, Transform, Load)** architecture using Pandas, ensuring the PostgreSQL database is protected from toxic data and formatting errors.

### Key Architectural Upgrades:
* **The Cleaning Engine (`services/data_cleaning_services.py`):** Intercepts raw `.xlsx`/`.csv` files and aggressively sanitizes them. Fixes localized string formatting (comma decimals), standardizes datetime schemas (`YYYY-MM-DD`), and strips trailing spaces to prevent SQL foreign key lookup failures.
* **Strict Business Rule Validation:** Utilizes Pandas vectorization to drop rows violating core market logic (e.g., volume < 0, High Price < Open Price) before database ingestion.
* **Dynamic SQL Generation (`update_sql_data_insertion.py`):** Python automatically translates the clean Pandas DataFrame into raw `.sql` commands, utilizing inline subqueries `(SELECT id FROM stocks WHERE symbol=...)` to dynamically map relational Foreign Keys on the fly.
* **Advanced Pandas Analytics (`services/pandas_analytics.py`):** A decoupled analytics service that allows high-speed, in-memory aggregation and filtering, bypassing the need for heavy analytical queries on the live production database.

### Pipeline Execution:
1. Ensure your Docker database is running and the base tables are created.
2. Run the cleaning service to sanitize the data and generate the Data Quality Audit Report.
3. Run the SQL Generator to prep the clean data for injection.
4. Launch the main application: `python main.py`