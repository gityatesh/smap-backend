# 📝 Day 18: Django API Architecture Notes

## Task 1: Understanding the Django Request Flow

**The Flow:** `Browser` ➔ `URL` ➔ `View` ➔ `Model` ➔ `Response`

**1. What is a URL?**
The URL (Uniform Resource Locator) acts as the switchboard. In Django (`urls.py`), it listens for specific web addresses (like `/stocks/TCS`) and routes that incoming traffic to the correct Python function (the View).

**2. What is a View?**
The View (`views.py`) is the brain of the operation. It receives the request from the URL, decides what data is needed, enforces business logic, and coordinates the response.

**3. What is a Model?**
The Model (`models.py`) is the blueprint for the database. The View talks to the Model (via the ORM) to securely fetch data from PostgreSQL without writing raw SQL.

**4. What is a Response?**
The Response is the package sent back to the user's browser. In a traditional web app, this might be an HTML webpage. In an API, it is purely raw data.

**5. What is JsonResponse?**
`JsonResponse` is a specific Django tool that takes Python dictionaries or lists and translates them into JSON (JavaScript Object Notation). JSON is the universal language of the web, allowing completely different systems (like a Python backend and a React frontend) to understand each other.

---

## Task 8: Engineering Thinking

**1. Why do applications expose APIs?**
APIs (Application Programming Interfaces) decouple the backend from the frontend. By exposing APIs, a single Django backend can serve data to a web browser dashboard, an iOS mobile app, and a third-party developer simultaneously.

**2. Why should users not connect directly to PostgreSQL?**
* **Security:** Exposing database credentials to the internet is a massive vulnerability.
* **Integrity:** Users could accidentally delete or corrupt tables.
* **Abstraction:** Users shouldn't need to know SQL just to see a stock price. APIs provide a safe, controlled middleman.

**3. What role does JsonResponse play?**
It is the translator. PostgreSQL stores relational data, Django uses Python objects, but the web browser only understands text and JSON. `JsonResponse` formats our database records into a clean, universally readable text format.

**4. How does Django ORM simplify development?**
It replaces hundreds of lines of fragile, error-prone SQL strings with clean, object-oriented Python (e.g., `Stock.objects.all()`). It also automatically protects the database against SQL injection attacks.

**5. How would a frontend application consume these APIs?**
A frontend application (built with JavaScript, React, or Vue) would use functions like `fetch()` or `axios` to make an HTTP GET request to our URL endpoints. Once it receives the JSON payload, it loops through the data to build visual charts or tables.

**6. How does today's work move the project closer to a real product?**
We are transitioning from an internal script to a "headless" backend service. The data is no longer locked on a local hard drive; it is now an accessible, structured service ready to power a modern web interface.