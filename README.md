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