DROP TABLE IF EXISTS stock_prices CASCADE;
DROP TABLE IF EXISTS stocks CASCADE;

CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    company_name VARCHAR(50) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    market_cap VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS stock_prices(
    id SERIAL PRIMARY KEY,
    stock_id INTEGER NOT NULL REFERENCES stocks(id),
    symbol VARCHAR(50) NOT NULL,
    trade_date DATE NOT NULL,
    open_price DECIMAL(10,2), 
    high_price DECIMAL(10,2),
    low_price DECIMAL(10,2),
    close_price DECIMAL(10,2),
    volume BIGINT
);

