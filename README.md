# 📈 Stock Market Analytics Platform (SMAP)

A production-ready, full-stack cloud application designed to ingest, clean, and serve daily stock market data. SMAP features a decoupled architecture, utilizing a fault-tolerant Pandas ETL pipeline, a serverless PostgreSQL vault, a Django REST API, and a dynamic React frontend.

Most stock market scripts pull data into Python and use slow `for` loops to calculate metrics or save to bulky `.csv` files. SMAP is built differently. It is engineered from scratch for high performance, utilizing cloud-native deployment and in-memory data processing to deliver zero-latency financial intelligence.

🌐 **Live Demo:** [Insert Your Vercel Link Here]
⚙️ **API Endpoint:** [Insert Your Render Link Here]

---

## ✨ Core Features

* **☁️ Cloud-Native Architecture:** Fully decoupled system with the React UI hosted globally on Vercel, the Django API running on Render, and data persisting in a serverless Neon PostgreSQL vault.
* **📊 Dynamic React Terminal:** A responsive, component-based frontend built with Vite. Features interactive Recharts for time-series visualization and a dynamic historical data ledger for deep-dive session analysis.
* **🤖 Autonomous ETL Pipeline:** Extracts live market data from Yahoo Finance via API, with an automated `BeautifulSoup` web-scraper fallback. Powered by `APScheduler` to run autonomously on the cloud server without manual execution.
* **⚡ In-Memory Processing (Zero Disk I/O):** Data flows directly from Extraction to Transformation to Loading as Pandas DataFrames in RAM, completely eliminating slow `.csv` read/write operations.
* **🌐 REST API Layer:** Engineered to handle large datasets efficiently. Features built-in pagination and CORS security, exclusively serving the React frontend.

---

## 🏗️ System Architecture

This project strictly adheres to the **Separation of Concerns** principle. The architecture is completely decoupled into an independent frontend, an ingestion engine, and a web presentation layer, meeting at a shared cloud database:

* `smap_frontend/` **(The UI Layer):** A React/Vite application managing state, dynamic routing, and data visualization.
* `etl/` **(Data Engineering):** Contains the primary Extractor, Scraper Fallback, Transformer, and Loader scripts.
* `smap_web/` **(The Web Server):** The master Django project configuration, handling routing, CORS policies, and WSGI/ASGI gateways via Gunicorn.
* `stocks/` **(The Application):** The Django app handling financial data, `models.py` (database blueprints), and the REST API views.
* `stocks/management/commands/` **(Automation):** Bridges the ETL pipeline to the Django environment for seamless scheduler execution.
---
**Prerequisites:** Node.js, Python 3.10+, and a configured `.env` file for database credentials.
---
## 🌐 Live Demo

SMAP is fully deployed and publicly accessible.

🔗 **Try it now:** : [Smap Web App](https://smap-frontend.vercel.app/)

Explore real-time market data, interactive visualizations, and the complete full-stack cloud architecture in action.
---
# 📅 Project Changelog

## v1.0.0 — Foundation

- Established the core **N-Tier Architecture**.
- Containerized the **PostgreSQL** database for reliable and portable data storage.

---

## v2.0.0 — Data Quality Engine

- Integrated **Pandas** for data cleaning and transformation.
- Implemented an automated **Data Quality Reporting** system for detecting missing values and anomalies.

---

## v3.0.0 — Live Data Ingestion & Visual Analytics

- Implemented a **Yahoo Finance ETL Pipeline** for live market data ingestion.
- Integrated **Matplotlib** and **Seaborn** for financial data visualization.

---

## v4.0.0 — Web Architecture & API Layer

- Migrated the backend to a **Django** web platform.
- Leveraged **Django ORM** for database operations.
- Developed scalable **RESTful APIs** with:
  - Pagination
  - Search query filtering

---

## v5.0.0 — Full-Stack Cloud Deployment *(Current)*

- Built a decoupled **React + Vite** frontend.
- Integrated **Recharts** for interactive financial visualizations.
- Implemented dynamic state management for a responsive user experience.
- Migrated from a local Docker database to a **Neon PostgreSQL** serverless cloud database.
- Automated the ETL pipeline using **APScheduler** and Django Management Commands.
- Successfully deployed the decoupled application to production using:
  - **Vercel** (Frontend)
  - **Render** (Backend)

---

## v6.0.0 — Machine Learning & Advanced Workflows *(Next Phase)*

- Integrate foundational **Machine Learning** algorithms:
  - Classification
  - Clustering
- Expand the Django architecture to support:
  - User Authentication
  - E-Commerce relational models
  - Advanced application state management

---

# 🔭 Long-Term Vision (Production Launch)

Transform **SMAP** from a financial dashboard into a fully deployed **AI-driven market intelligence platform**.

### Planned Features

#### 🤖 AI-Powered Insights
- Real-time market visualization
- LSTM-based stock forecasting
- Transformer-based predictive analytics

#### 👤 Advanced User Workflows
- Secure user authentication
- Personalized stock portfolios
- Saved watchlists
- Custom financial metrics

#### ⚙️ Scalable Data Infrastructure
- Fully automated ETL pipeline
- Fault-tolerant data ingestion
- Continuous transformation of raw financial data into actionable intelligence
- Production-ready cloud architecture

