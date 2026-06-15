import pandas as pd

class PandasAnalyticsService:
    def __init__(self):
        # Loads the dataset once when the service is called
        try:
            self.df = pd.read_csv('data/stock_export.csv')
        except FileNotFoundError:
            print("Error: data/stock_export.csv not found. Please run export_data.py first.")

    def get_market_analysis(self):
        totalmarketvolume = self.df['volume'].sum()
        print(f'total market value: {totalmarketvolume}')
        
        #to find stock with highest closing price
        highestclosingprice = self.df.loc[self.df['close_price'].idxmax()]
        print(f'highest closing price is of {highestclosingprice['symbol']}: {highestclosingprice['company_name']} on inr {highestclosingprice['close_price']}')
        
        averagecp= self.df['close_price'].mean()
        print(f'avg cloing price: {averagecp:0.3f}')
        
        
    def show_filtered_views(self):
        print("\n--- TASK 5: FILTERED MARKET VIEWS ---")
        
        # 1. Filter by Sector
        tech_stocks = self.df[self.df['sector'] == 'Technology']
        print("\n[Tech Sector Only]")
        print(tech_stocks)

        # 2. Filter by Price Range (e.g., Stocks under INR 1500)
        affordable = self.df[self.df['close_price'] < 1500]
        print("\n[Affordable Stocks < INR 1500]")
        print(affordable)

        # 3. Filter by Trading Volume (e.g., Highly traded > 3 Million)
        high_volume = self.df[self.df['volume'] > 3000000]
        print("\n[High Volume Stocks > 3M]")
        print(high_volume)


    def show_grouped_analysis(self):
        print("\n--- TASK 6: GROUPED SECTOR ANALYSIS ---")
        
        # Group by Sector and calculate the average price and total volume
        sector_summary = self.df.groupby('sector').agg({
            'symbol': 'count',         # Counts how many stocks are in the sector
            'close_price': 'mean',     # Calculates the average closing price
            'volume': 'sum'            # Adds up the total trading volume
        }).reset_index() # Resets index to make it look clean

        # Rename columns for a professional presentation
        sector_summary.columns = ['Sector', 'Total Stocks', 'Avg Price (INR)', 'Total Volume']
        
        # Format the Average Price to 2 decimal places
        sector_summary['Avg Price (INR)'] = sector_summary['Avg Price (INR)'].round(2)
        
        print(sector_summary.to_string(index=True))