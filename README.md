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

---
## Version History & Roadmap

Documenting the architectural evolution of the **Stock Market Analysis Platform (SMAP)**.

### v1.0.0 — The Foundation
- Established the base **N-Tier Architecture**.
- Implemented a **containerized PostgreSQL database** for data management.
- Relied entirely on **raw SQL queries** for mathematical computations, ranking logic, and analytical processing.
- Focused on creating a scalable and modular backend structure.

### v2.0.0 — The Data Quality Engine
- Integrated **Pandas** for offline data cleaning and preprocessing.
- Introduced strict **business rule validation** mechanisms.
- Implemented automated **Data Quality Reporting** for identifying inconsistencies and missing values.
- Added dynamic **Python-to-SQL script generation** to streamline database operations and reduce manual query development.

### v3.0.0 — Live Ingestion & Visual Analytics *(Current Release)*
- Deployed an automated **Yahoo Finance ETL Pipeline** for live market data extraction.
- Enabled scheduled data ingestion and transformation workflows.
- Integrated **Matplotlib** and **Seaborn** for dynamic visualization and reporting.
- Added graphical insights including trends, rankings, and performance analytics.
- Improved reporting capabilities with data-driven visual dashboards.

### v4.0.0 — The Web Transition *(Upcoming)*
- Migrating the terminal-based CLI application into a full-stack **Django** web platform.
- Developing an interactive browser-based dashboard for end users.
- Exposing backend databases and analytical services through web interfaces.
- Enabling real-time visualization, filtering, and portfolio analysis features.
- Preparing the platform for multi-user access, authentication, and future cloud deployment.

---

### Future Vision

The long-term objective of SMAP is to evolve into a comprehensive financial analytics platform that combines:

- Real-time market intelligence
- Automated data quality assurance
- Advanced analytical reporting
- Interactive web-based visualization
- Scalable cloud-native architecture

This roadmap reflects the continuous progression from a database-centric analytical tool to a complete end-to-end financial decision-support system.