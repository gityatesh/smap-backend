#task 4/5
'''Test File. Please dont use in production'''

import pandas as pd
class MarketAnalysis:
    def __init__(self):
        self.df = pd.read_csv('data/stock_export.csv')
        
    def get_market_analysis(self):
        totalmarketvolume = self.df['volume'].sum()
        print(f'total market value: {totalmarketvolume}')
        
        #to find stock with highest closing price
        highestclosingprice = self.df.loc[self.df['close_price'].idxmax()]
        print(f'highest closing price is of {highestclosingprice['symbol']}: {highestclosingprice['company_name']} on inr {highestclosingprice['close_price']}')
        
        averagecp= self.df['close_price'].mean()
        print(f'avg cloing price: {averagecp:0.3f}')
        
    def get_filtered_stocks(self):
        bankingstocks=self.df[self.df['sector']=='Banking']
        print(f'Banking stocks: \n{bankingstocks}')
        print()
        affordablestocks = self.df[self.df['close_price']<1500]
        print(f'affordable stocks: \n{affordablestocks}')
        print()
        mostactivestocks = self.df[self.df['volume']>120000]
        print(f'most active stocks: \n{mostactivestocks}')
        
if __name__=="__main__":
    print('market analysis: ')
    MarketAnalysis().get_market_analysis()
    print()
    print('Filtered stocks: ')
    MarketAnalysis().get_filtered_stocks()
    
'''For every insight generated, document:
What information was extracted
-total market volume, highest closing price(symbol, company name and price), average closing price
-filtering the data: banking stocks, most active stocks and cheap stocks

Why the information is useful
-info is what we actually want instead of showing all the raw data and then we have to manually find stcoks from it

How it contributes to understanding market behaviour
-can be used to track the growth of stocks, or helps in makeing decision which stock to choose and which not to'''