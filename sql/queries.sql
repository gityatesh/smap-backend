--highest closing price
SELECT s.symbol, s.company_name, sp.close_price, sp.trade_date
FROM stocks s
JOIN stock_prices sp
ON s.id = sp.stock_id
ORDER BY close_value DESC
LIMIT 1;

--lowest closing price
SELECT s.symbol, s.company_name, sp.close_price, sp.trade_date
FROM stocks s
JOIN stock_prices sp
ON s.id = sp.stock_id
ORDER BY close_value 
LIMIT 1;

--average closing price
SELECT avg(closing_price) AS average_closing_price
FROM stock_prices;

--maximum trading volume
SELECT s.symbol, s.company_name, sp.volume, sp.trade_date
FROM stocks s
JOIN stock_prices sp
ON s.id = sp.stock_id
ORDER BY volume DESC
LIMIT 1;

--minimum trading value
SELECT s.symbol, s.company_name, sp.volume, sp.trade_date
FROM stocks s
JOIN stock_prices sp
ON s.id = sp.stock_id
ORDER BY volume
LIMIT 1;