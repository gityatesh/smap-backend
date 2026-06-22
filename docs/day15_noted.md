# FAQs
### 1. Why do we need Django if we already have Python?
Python is just a programming language. It doesnt know how to repond to HTTPS request.
Django is a massive framework built on python which provides readymade web-server, URL Routing, HTTPS generation and massive security.
---
### 2. Why should ETL remain independent of Django?
ETL pipelines are slow, mathematically intense and very heavy. Web servers need to be lightweight and lightning-fast to serve thousands of users. If we put the ETL pipeline inside the web server, every time the app downloads stock data, the entire website would freeze for all users until the download finished.
---
### 3. Why should analytics not directly call Yahoo Finance?
->Speed: it takes time to call api rather than just querying the local database.\
->Intigrity: if yahoo finance goes down tomorrow then our whole analytics will crash if we directly call yahoo finance.\
->Data Intigration: If we directly import from yahoo finance, corrupt data might reach our database which we dont want.
---
### 4. Why is PostgreSQL important in this project?
While Django comes with SQLite, SQLite locks the entire database when someone writes to it. Because we have an automated ETL pipeline constantly injecting thousands of stock prices while web users are simultaneously reading those prices, we need a robust, enterprise-grade database like PostgreSQL that supports concurrent operations and advanced window ranking functions.
---
### How will Django help us build APIs in Week 4?
Django will act as a translator. Django REST framework will take our complex PostgreSQL database rows, convert them into standard JSON format, and serve them securely to the frontend web browser so we can build dynamic graphs.