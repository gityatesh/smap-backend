# 📈 Stock Market Analytics Platform (SMAP)

> A production-ready, containerized system designed to ingest, clean, and serve daily stock market data, currently transitioning into a full-stack Django web application and REST API.

Most stock market scripts pull data into Python and use slow `for` loops to calculate metrics or save to bulky `.csv` files. **SMAP is built differently.** It is engineered using a decoupled, N-Tier architecture, utilizing a fault-tolerant, in-memory Pandas ETL pipeline for data ingestion, a containerized PostgreSQL engine for data storage, and a Django REST framework for data delivery.

## ✨ Core Features

* 📊 **Fault-Tolerant ETL Pipeline:** Extracts live market data from Yahoo Finance via API, with an automated `BeautifulSoup` web-scraper fallback that seamlessly takes over if the primary API fails or hits rate limits.
* ⚡ **In-Memory Processing (Zero Disk I/O):** Data flows directly from Extraction to Transformation to Loading as Pandas DataFrames in RAM, completely eliminating slow `.csv` read/write operations.
* 💾 **Containerized Vault:** The PostgreSQL database runs completely isolated inside Docker. Using explicit Volume Mapping, the data persists safely on the hard drive even if the container is destroyed.
* 🌐 **REST API Layer:** Engineered to handle large datasets efficiently. Features built-in pagination for time-series data and dynamic search filtering (`?search=`) across the database vault.
* ⚙️ **Custom Django Automation:** Features custom management commands (`run_etl`) to execute complex data pipelines directly through the web server's terminal environment.

---

## 🏗️ System Architecture

This project strictly adheres to the **Separation of Concerns** principle. The architecture is decoupled into an ingestion engine and a web presentation layer, meeting at a shared database:

* **`etl/` (Data Engineering):** Contains the primary Extractor, Scraper Fallback, Transformer, and Loader scripts. 
* **`smap_web/` (The Web Server):** The master Django project configuration, routing, and WSGI/ASGI gateways.
* **`stocks/` (The Application):** The Django app handling financial data, `models.py` (database blueprints), and the REST API views.
* **`stocks/management/commands/` (Automation):** Bridges the ETL pipeline to the Django environment for seamless execution.
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

### 2. Run the Migrations & ETL
Activate your virtual environment, navigate into the Django project directory, setup the database, and trigger the in-memory data pipeline:
```bash
cd smap_web
python manage.py makemigrations
python manage.py migrate
python manage.py run_etl
```
### 3. Launch the API
With the vault populated, start the local server to access the data:
```bash
python manage.py runserver
```

# Project Changelog

### v1.0.0 — Foundation

- Established the core **N-Tier Architecture**.
- Deployed a containerized **PostgreSQL** database for persistent data storage and management.

---

### v2.0.0 — Data Quality Engine

- Integrated **Pandas** for data cleaning, transformation, and preprocessing.
- Developed an automated **Data Quality Reporting System** to identify missing values and data anomalies.

---

### v3.0.0 — Live Data Ingestion & Visual Analytics

- Implemented an automated **Yahoo Finance ETL Pipeline** for live market data acquisition.
- Integrated **Matplotlib** and **Seaborn** for analytical visualization and reporting.

---

### v4.0.0 — Web Architecture & API Layer *(Completed)*

- Migrated the application backend into a full-stack **Django** web platform.
- Replaced direct database interactions with **Django ORM (Object-Relational Mapping)**.
- Upgraded the ETL pipeline to be completely **in-memory**, eliminating CSV dependencies.
- Built a custom **HTML Web Scraper** fallback to ensure fault tolerance during API outages.
- Developed scalable **RESTful APIs** featuring:
  - Data pagination
  - Search query filters
- Created custom **Django management commands** for automated pipeline execution.

### v5.0.0 — Machine Learning Foundations & Cloud Deployment *(Weeks 5-6)*
- Integrating foundational Machine Learning algorithms, focusing on Classification and Clustering techniques for market analysis.
- Expanding the Django web architecture to support complex, multi-step application workflows (transitioning from API-only to full-stack website implementation).
- Establishing the cloud CI/CD pipeline: Preparing the Frontend for deployment on **Vercel** and the Backend/Database for **Railway/Render**.

---

### v6.0.0 — AI Forecasting & Deep Learning *(Weeks 7-8)*
- Upgrading the backend with Deep Supervised Learning models (CNNs, RNNs, LSTMs, Transformers, BERT).
- Exploring Reinforcement Learning (RL) and Self-Supervised Learning (Embedding systems) for advanced market pattern recognition.
- **Core Milestone:** Deploying a state-of-the-art **Stock Prediction & Forecasting Model**. This engine will consume the semi-structured JSON data ingested by the Week 3/4 Web Crawling pipeline and run it through LSTMs/Transformers to predict future price action.

---

### Long-Term Vision (Production Launch)

Transform SMAP from a local development environment into a fully deployed, AI-driven stock market intelligence platform. The final production architecture will feature:

- **AI-Powered Insights:** Real-time market visualization combined with state-of-the-art LSTM and Transformer forecasting models.
- **Cloud-Native Architecture:** A modern frontend deployed globally on Vercel, backed by a robust Django REST API and PostgreSQL vault hosted on Railway/Render.
- **Scalable Data Ingestion:** A fully automated, fault-tolerant ETL pipeline that continuously structures raw financial data into actionable intelligence.