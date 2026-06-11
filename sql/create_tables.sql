CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    company_name VARCHAR(50) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    market_cap VARCHAR(20) NOT NULL
);

CREATE TABLE stock_prices(
    id SERIAL PRIMARY KEY,
    stock_id INTEGER NOT NULL REFERENCES stocks(id),
    trade_date DATE NOT NULL,
    open_price DECIMAL(10,2), 
    high_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    close_price DECIMAL(10,2),
    volume BIGINT
);