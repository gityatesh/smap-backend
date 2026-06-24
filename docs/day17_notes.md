# 📝 Day 17: Database Integration & Web Architecture Notes

## Task 1: Reviewing the Current ETL Flow (The CSV Problem)

**1. What data is currently being fetched?**
The pipeline extracts daily market metrics (Open, High, Low, Close, Volume) and basic company metadata directly from the Yahoo Finance API.

**2. Where is the data currently stored?**
It is temporarily held in Pandas DataFrames during the transformation phase, and finally dumped into static `.csv` flat files on the local hard drive.

**3. What limitations exist with CSV storage?**
* **No Concurrency:** If two users try to write to the CSV at the same exact millisecond, the file corrupts or locks.
* **Terrible Query Performance:** To find the highest price of TCS in 2025, Python has to read the entire file top-to-bottom. 
* **Data Duplication:** Without primary keys, running the ETL twice might append the exact same day's data twice, ruining our math.
* **No Relationships:** A CSV cannot link a company's profile data (Sector, Market Cap) dynamically to its daily prices without massive, redundant files.

---

## Task 8: Engineering Thinking (The PostgreSQL Solution)

**1. Why is PostgreSQL better than CSV for long-term storage?**
PostgreSQL is a relational database engine. It provides ACID compliance (guaranteeing data safety), allows thousands of simultaneous read/write operations without locking, and uses indexing so searching for a specific date takes milliseconds instead of seconds. 

**2. What role does Django ORM play?**
The Object-Relational Mapper (ORM) is the bridge. Instead of writing raw `INSERT INTO` SQL strings that are vulnerable to syntax errors and security flaws, the ORM allows us to save data using secure, object-oriented Python commands (e.g., `StockPrice.objects.create()`). 

**3. Why should ETL load data into a database?**
To establish a "Single Source of Truth." The ETL engine acts as the background worker, constantly cleaning and loading data into the vault. The web application (Django) acts as the frontend, purely reading from that vault. They are decoupled, meaning the web app never has to pause and wait for a Yahoo Finance download.

**4. Why store raw JSON responses?**
For audit trails and disaster recovery. If our Pandas transformation logic has a bug and calculates a moving average incorrectly, the transformed data is ruined. If we have the original, raw JSON saved in our database, we can simply re-run the cleaning process without having to request the data from Yahoo Finance again (saving API limits).

**5. How will today's work help build APIs tomorrow?**
Tomorrow, we will use the Django REST Framework. If the data is already securely structured inside Django models, the framework can automatically serialize those models into clean JSON endpoints for a web dashboard in just three lines of code.