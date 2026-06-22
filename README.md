# 📈 Stock Market Analytics Platform (SMAP)

> A production-ready, containerized system designed to ingest, clean, and serve daily stock market data, currently transitioning into a full-stack Django web application.

Most stock market scripts pull data into Python and use slow `for` loops to calculate metrics. **SMAP is built differently.** It is engineered using a decoupled, N-Tier architecture, utilizing an automated Pandas ETL pipeline for data ingestion, a containerized PostgreSQL engine for data storage, and a Django web framework for data delivery.

## ✨ Core Features

* 📊 **Automated ETL Pipeline:** Extracts live market data from Yahoo Finance, cleans anomalies using Pandas, and enforces strict business validation rules.
* 💾 **Containerized Vault:** The PostgreSQL database runs completely isolated inside Docker. Using explicit Volume Mapping, the data persists safely on the hard drive even if the container is destroyed.
* 🌉 **Django ORM Integration:** Replaces raw SQL scripts with a secure, Pythonic Object-Relational Mapper to seamlessly bridge the web server to the database.
* 🖥️ **Interactive Terminal GUI (Legacy):** Features a clean, menu-driven CLI that unpacks complex data dictionaries into perfectly aligned, readable dashboards. (Currently being migrated to Web Views).
* 📈 **Visual Analytics:** Generates dynamic graphical insights including trends, rankings, and performance analytics using Matplotlib and Seaborn.

---

## 🏗️ System Architecture

This project strictly adheres to the **Separation of Concerns** principle. The architecture is decoupled into an ingestion engine and a web presentation layer, meeting at a shared database:

* **`etl/` (Data Engineering):** Contains the Extractor, Transformer, and Loader scripts. Uses Pandas to clean live API data before it ever touches the database.
* **`smap_web/` (The Web Server):** The master Django project configuration, routing, and WSGI/ASGI gateways.
* **`stocks/` (The Application):** The specific Django app handling financial data. Contains the `models.py` (database blueprints) and future API views.
* **`docker-compose.yml` (Infrastructure):** Defines the portable PostgreSQL environment.

---

## 🚀 Quick Start Guide

### Prerequisites
* Python 3.10+
* Docker Desktop installed and running
* Virtual Environment configured

### 1. Spin up the Infrastructure
SMAP relies on a portable Docker environment for its database. Open your terminal in the project root and run:
```bash
docker-compose up -d
```
Activate your virtual environment, navigate into the Django project directory, and launch the local server:
```bash
cd smap_web
python manage.py runserver
```

---
## Version History & Roadmap

Documenting the architectural evolution of the **Stock Market Analysis Platform (SMAP)**.

### v1.0.0 — Foundation

- Established the core **N-Tier Architecture**.
- Deployed a containerized **PostgreSQL** database for persistent data storage and management.
- Implemented market analytics and computations using raw SQL queries.

---

### v2.0.0 — Data Quality Engine

- Integrated **Pandas** for data cleaning, transformation, and preprocessing.
- Developed an automated **Data Quality Reporting** system to identify missing values, inconsistencies, and data anomalies.
- Improved overall data reliability and validation workflows.

---

### v3.0.0 — Live Data Ingestion & Visual Analytics

- Implemented an automated **Yahoo Finance ETL Pipeline** for live market data acquisition.
- Established data extraction, transformation, and loading workflows for continuous updates.
- Integrated **Matplotlib** and **Seaborn** for analytical visualization and reporting.
- Enhanced the platform with graphical insights and trend analysis capabilities.

---

### v4.0.0 — Web Architecture *(In Progress)*

- Migrating the terminal-based application into a full-stack **Django** web platform.
- Replacing direct database interactions and raw SQL operations with Django's **Object-Relational Mapping (ORM)**.
- Designed and implemented the core relational models:
  - `DataSource`
  - `Stock`
  - `StockPrice`
- Currently integrating the ETL pipeline with the Django ORM.
- Developing RESTful APIs and backend services for web-based data access.

---

### v5.0.0 — Interactive Dashboard *(Planned)*

- Building a browser-based interactive dashboard for end users.
- Enabling real-time market visualization, filtering, and portfolio analysis.
- Expanding API capabilities to support advanced analytics and frontend integrations.
- Implementing user authentication, authorization, and multi-user support.
- Preparing the platform for cloud deployment and production scalability.

---

### Long-Term Vision

Transform SMAP into a comprehensive stock market intelligence platform capable of:

- Automated data acquisition and validation.
- Advanced financial analytics and forecasting.
- Interactive dashboards and portfolio management.
- Scalable cloud-native deployment.
- Multi-user collaboration and personalized insights.