# Stock Market Analytics Platform (SMAP) - Core Backend

A scalable backend architecture engineered with Python and PostgreSQL for storing, managing, and analyzing stock market data.

## 1. Project Architecture
The system follows a modular, decoupled architecture:
* **Data Layer:** PostgreSQL database handling normalized, relational stock data.
* **Access Layer:** Repository Pattern (Data Access Objects) to isolate SQL execution.
* **Business Layer:** Service classes handling analytics, ranking, and aggregation logic.
* **Presentation Layer:** A CLI-based Controller (`main.py`) routing user inputs to the services.

## 2. Entity Design
The system operates on two core entities:
* **Stock:** Represents the master profile of a publicly traded company (Symbol, Name, Sector, Market Cap).
* **StockPrice:** Represents the daily trading metrics for a specific stock (Date, Open, High, Low, Close, Volume).

## 3. Database Design
The database (`stock_market_db`) uses a strict One-To-Many relational model.
* **`stocks` table:** Contains unique master records. `id` is the Primary Key.
* **`stock_prices` table:** Contains daily trading data. `stock_id` acts as a Foreign Key referencing the `stocks` table to prevent orphaned data.

## 4. Folder Structure Design
```text
stock_market_platform/
├── main.py                     # Application Controller
├── models/                     # Python Dataclasses (stock.py, stock_price.py)
├── repositories/               # Data Access Objects for SQL execution
├── services/                   # Business logic and analytics
├── data/                       # Raw JSON data sources
├── reports/                    # Generated .txt output files
└── sql/                        # DDL scripts and analytical queries