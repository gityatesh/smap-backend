import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
import time # Required for the sleep delay

class WebScraperExtractor:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def fetch_page_soup(self, url):
        """Helper method to safely fetch a webpage and parse it into a BeautifulSoup object."""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            if response.status_code == 200:
                return BeautifulSoup(response.text, 'html.parser')
            else:
                print(f"⚠️  Failed to reach page. Status Code: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Network request crashed: {e}")
            return None

    def extract_live_batch(self, symbols: list):
        """Scrapes the live market price for a list of tickers directly from the HTML layer."""
        print(f"🕵️ Starting Live HTML Extraction Run for {len(symbols)} symbols...")
        
        extracted_records = []
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        for symbol in symbols:
            print(f"  Fetching HTML for {symbol}...")
            url = f"https://finance.yahoo.com/quote/{symbol}/"
            soup = self.fetch_page_soup(url)
            
            if not soup:
                # If we fail to get the soup, we still need to sleep before the next request!
                time.sleep(5)
                continue
                
            try:
                def get_metric(field_name):
                    tag = soup.find('fin-streamer', {'data-field': field_name})
                    if tag and tag.text:
                        return float(tag.text.replace(',', ''))
                    return 0.0 

                close_price = get_metric('regularMarketPrice')
                open_price = get_metric('regularMarketOpen')
                high_price = get_metric('regularMarketDayHigh')
                low_price = get_metric('regularMarketDayLow')
                volume = int(get_metric('regularMarketVolume'))

                if close_price > 0:
                    record = {
                        'Date': current_time,
                        'Symbol': symbol.upper(),
                        'Open': open_price,
                        'High': high_price,
                        'Low': low_price,
                        'Close': close_price,
                        'Volume': volume
                    }
                    extracted_records.append(record)
                    print(f"    ✅ Extracted full metrics for {symbol}")
                else:
                    print(f"    ⚠️ Core price tag not found for {symbol}.")
                    
            except Exception as e:
                print(f"    ❌ Error parsing HTML elements for {symbol}: {e}")

            # THE FIX: This is now safely inside the loop
            time.sleep(5)

        if extracted_records:
            df = pd.DataFrame(extracted_records)
            print("📊 Batch extraction successfully transformed into memory DataFrame!")
            return df
        else:
            print("❌ No data records could be extracted from the HTML source.")
            return None