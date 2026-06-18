# 📘 Engineering Notes: Data Ingestion & ETL Foundations
**Module:** Stock Market Analytics Platform v3
**Topic:** Automating external data acquisition and standardization.

## Part 1

### Data Injection
process of accessing data direcly from any external sources (like yahoo finance, an SQL database etc.) and bringing it at our system boudary 

### What is data pipeline?
automated sequence of softwares running constanty to mve data from vendors within our system boundry.

### what is ETL?
standard architecture for data pipeline
e->extract
t->transform
l->load

### ETL vs ELT
-> raw data is extracted and cleaned 1st inside the memory and then loaded inside the data warehouse.
-> raw data is directly dumped inside the data wharehouse/data lake and then tranformed using SQL queries. Best for big data architecture where cloud storages are cheap.


## part2

### ELT pipeline requirements
In realwrold, we cannot gaurantee perfect data for our system. Formats keep getting cahnged and can crash our systems.
ETL act as firewall. It molds and cleans the data in format which is required by software, so that we can perform functions on it

### Why data sources separate from analytics
Reason is APIs. If yahoo changes there api then teh whole engine will crash. By decoupling the code we just have to changes the extracter and the rest of the code remains safe. System is unharmed and can work properly.

### Why not transformation before extraction
We dont want to ping our external api 10000 times just to veryfiy that the data we want is in the correct format or not. Hence tranformation is done after extraction.

### Limitations
-> Rate Limiting: APIs get blocked when we request data too fast
-> Schema Drift: Vendors can change the coloumn name slightly without a warning
-> Network Fails: Timeout or system crashes
-> Dirty Inputs: Letters instead of numbers etc.

### Prepration of platform for ML
ML requires large amount of flawless data. By using these elt pipelines, we are making a perfect platform to feed the model tons of perfect data without any human intervention.