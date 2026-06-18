--last updated: June 18, 2026 at 01:35 PM
-- 0. Wipe Old Data
DELETE FROM stock_prices;
DELETE FROM stocks;

-- 1. Master Stocks Table (Dimension)
INSERT INTO stocks (symbol, company_name, sector, market_cap) VALUES
('RELIANCE', 'Reliance Industries', 'Energy', 'Large Cap'),
('TCS', 'Tata Consultancy Services', 'Technology', 'Large Cap'),
('INFY', 'Infosys', 'Technology', 'Large Cap'),
('HDFCBANK', 'HDFC Bank', 'Banking', 'Large Cap'),
('ICICIBANK', 'ICICI Bank', 'Banking', 'Large Cap'),
('ITC', 'ITC Limited', 'Consumer Goods', 'Large Cap'),
('BHARTIARTL', 'Bharti Airtel', 'Telecom', 'Large Cap'),
('LT', 'Larsen & Toubro', 'Infrastructure', 'Large Cap'),
('HINDUNILVR', 'Hindustan Unilever', 'Consumer Goods', 'Large Cap'),
('SBIN', 'State Bank of India', 'Banking', 'Large Cap');

INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-01', 3500, 3550, 3480, 3520.0, 80000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-02', 3520, 3565, 3510, 3550.0, 82000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-03', 3550, 3590, 3535, 3575.0, 84000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='INFY'), 'INFY', '2026-06-01', 1600, 1625, 1590, 1610.0, 90000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='INFY'), 'INFY', '2026-06-03', 1625, 1640, 1615, 1630.0, 95000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='HDFCBANK'), 'HDFCBANK', '2026-06-01', 1700, 1720, 1680, 1710.0, 120000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='HDFCBANK'), 'HDFCBANK', '2026-06-03', 1720, 1745, 1715, 1735.0, 130000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='ICICIBANK'), 'ICICIBANK', '2026-06-01', 1100, 1125, 1090, 1110.0, 135000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='ICICIBANK'), 'ICICIBANK', '2026-06-03', 1120, 1145, 1115, 1135.0, 140000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='ITC'), 'ITC', '2026-06-01', 420, 430, 418, 425.0, 200000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='ITC'), 'ITC', '2026-06-02', 425, 435, 420, 430.0, 205000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='BHARTIARTL'), 'BHARTIARTL', '2026-06-01', 1500, 1525, 1490, 1510.0, 145000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='BHARTIARTL'), 'BHARTIARTL', '2026-06-03', 1525, 1545, 1515, 1540.0, 150000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='LT'), 'LT', '2026-06-01', 3200, 3230, 3185, 3210.0, 70000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='LT'), 'LT', '2026-06-02', 3210, 3250, 3200, 3235.0, 72000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='LT'), 'LT', '2026-06-03', 3235, 3270, 3225, 3250.0, 74000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='HINDUNILVR'), 'HINDUNILVR', '2026-06-01', 2600, 2635, 2585, 2615.0, 65000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='HINDUNILVR'), 'HINDUNILVR', '2026-06-02', 2615, 2640, 2600, 2630.0, 67000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='HINDUNILVR'), 'HINDUNILVR', '2026-06-03', 2630, 2655, 2620, 2645.0, 69000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='SBIN'), 'SBIN', '2026-06-01', 850, 875, 845, 860.0, 250000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='SBIN'), 'SBIN', '2026-06-02', 860, 885, 855, 875.0, 255000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='SBIN'), 'SBIN', '2026-06-03', 875, 895, 870, 890.0, 260000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-04', 3580, 3600, 3570, 3590.0, 85000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-05', 3590, 3610, 3580, 3600.0, 86000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-06', 3600, 3620, 3590, 3610.0, 87000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2030-01-01', 3650, 3670, 3640, 3660.0, 90000.0);
INSERT INTO stock_prices (stock_id, symbol, trade_date, open_price, high_price, low_price, close_price, volume) VALUES ((SELECT id FROM stocks WHERE symbol='TCS'), 'TCS', '2026-06-14', 3600, 3620, 3590, 350000.0, 88000.0);
