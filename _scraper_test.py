'''Test File. Please dont use in production'''

import requests
from bs4 import BeautifulSoup

def scrap_live_price(symbol):
    try:
        print('Starting scraping....')
        url = f"https://finance.yahoo.com/quote/{symbol}/"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }#headers help us not getting blocked by the websites
        
        print('fetching data from site...')
        response = requests.get(url, headers=headers)
        if response.status_code !=200:
            print(f'failed to retrive data. error status: {response.status_code}')
            
        soup = BeautifulSoup(response.text, 'html.parser')#converts teh raw data into human readable format
        '''# Yahoo Finance currently stores the live price inside a custom tag called <fin-streamer>
        that has the attribute data-field="regularMarketPrice"'''
        price_tag = soup.find('fin-streamer', {'data-field': 'regularMarketPrice'})
        
        if price_tag:
            live_price = price_tag.text
            print(f'Success: live price for {symbol} is |₹{live_price}|')
            return price_tag
        else:
            print('couldnt find price tag!')
    
    except Exception as e:
        print(f'scraping crashed: {e}')
        
if __name__ == "__main__":
    scrap_live_price('AAPL')    
    
        