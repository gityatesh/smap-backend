# 🏗️ Week 4 Web Architecture & Engineering Strategy

## 1. The System Architecture Flow (Task 7)
The Stock Market Analytics Platform (SMAP) follows a decoupled, N-Tier architecture. The data ingestion engine is completely separated from the web server, meeting at a shared PostgreSQL database.

```text
[Yahoo Finance API] ➔ The External Data Source
       ↓
[ETL Pipeline]      ➔ The Engine: Extracts raw data, cleans it using Pandas, and validates business rules.
       ↓
[PostgreSQL]        ➔ The Vault: Containerized database. Stores cleaned historical data safely.
       ↓
[Django Models]     ➔ The ORM: Python classes that map directly to the PostgreSQL tables.
       ↓
[Django APIs]       ➔ The Router: Translates database rows into JSON for web consumption.
       ↓
[Analytics]         ➔ The Brain: Runs Pandas/SQL aggregations on demand.
       ↓
[Web Reports]       ➔ The Interface: Visualizes data using interactive charts on a web dashboard.