from services.analytic_services import AnalyticalService
from services.stock_services import StockServices
from services.ranking_services import RankStocks
from services.report_service import ReportService
from services.pandas_analytics import PandasAnalyticsService
import setup.setup_db
import sql.update_sql_data_insertion
import services.data_cleaning_services 
from services.graph_services import GraphingService
from etl.etl_pipeline import ETLPipeline

def main():
    analytics = AnalyticalService()
    stock = StockServices()
    ranking = RankStocks()
    report = ReportService()
    graph = GraphingService()
    
    while True:
        print("----------Menu----------")
        print("1. View All Stocks")
        print("2. Search Stock")
        print("3. View Analytics")
        print("4. View Rankings")
        print("5. Generate Reports")
        print("6. Advance Pandas Analytics")
        print("7. Graph service")
        print('8. Exit')
        
        choice = int(input('Enter your choice: '))
        
        if choice == 1:
            stocks = stock.show_all_stocks()
            for s in stocks:
                print(f'{s.symbol}|{s.company_name}|{s.sector}')
                
        elif choice == 2:
            keyword = input('Enter stock name: ')
            if keyword:
                search = stock.search_stocks(keyword)
                for x in search:
                    print(f'Symbol: {x.symbol}| Name: {x.company_name} \n')
            else: print('Wrong keyword! try again.')
            
        elif choice == 3:
            summ = analytics.show_market_summry()
            
            # 1. Unpack the nested data for clean access
            hc = summ.get("Highest Closing Price", {})
            lc = summ.get("Lowest Closing Price", {})
            avg = summ.get('Average Closing Price')
            ma = summ.get("Most Active Stock", {})
            la = summ.get("Least Active Stock", {})
            
            # 2. Print a professional summary
            print("\n--- EXECUTIVE MARKET SUMMARY ---")
            print(f"Highest Closing Price: {hc.get('symbol')} (INR {hc.get('close_price')})")
            print(f"Lowest Closing Price:  {lc.get('symbol')} (INR {lc.get('close_price')})")
            print(f"Average Closing Price: INR {avg.get('average_closing_price'): 0.2f}")
            print(f"Most Active Stock:     {ma.get('symbol')} (Vol: {ma.get('volume')})")
            print(f"Least Active Stock:    {la.get('symbol')} (Vol: {la.get('volume')})")
            
        elif choice == 4:
            print('1. by Price | 2. by Volume | 3. by Growth')
            i = int(input('Select type: '))

            if i == 1: data = ranking.rankbyprice()
            elif i == 2: data = ranking.rankbyvolume()
            elif i == 3: data = ranking.rankbygrowth()
            else: 
                print("Invalid choice")
                continue

            print(f"\n{'RANK':<6} | {'SYMBOL':<10} | {'VALUE':<15}")
            print("-" * 35)

            
            for row in data:
                rank = row.get('market_rank', 'N/A')
                symbol = row.get('symbol', 'N/A')
                
                if i == 1: val = f"INR {row.get('close_price')}"
                elif i == 2: val = f"{row.get('volume')} units"
                else: val = f"{row.get('growth_percent')}%"
                
                print(f"{rank:<6} | {symbol:<10} | {val:<15}")
        
        elif choice == 5:
            report.generate_report()
            report.generate_summary()
            
        elif choice == 6:
            PandasAnalyticsService().get_market_analysis()
            PandasAnalyticsService().show_filtered_views()
            PandasAnalyticsService().show_grouped_analysis()
            
        elif choice==7:
            print('1. Time-Series | 2. Stock Activity | 3. Volatility')
            i = int(input('Choose Graph Type:'))
            if i==1: 
                stock = input('Enter stock: ')
                graph.timeseries(stock)
            elif i==2:graph.bargraphvol()
            elif i==3:graph.price_fluctuation_graph()
            else:print('Invalid choice!!')
            
        elif choice == 8:
            print('Shutting down...\n ThankYou for using!')
            break
        else:
            print('Invalid choice! Please try again.')
            
if __name__ == '__main__':
    print('------ STOCK MARKET ANALYTICS PLATFORM (SMAP) ------')
    print('1. Boot with existing database data')
    print('2. Fetch fresh market data from Yahoo Finance')
    
    try:
        boot_choice = int(input('Enter your Choice: '))
    except ValueError:
        boot_choice = 1 # Default to existing if they hit enter or type a letter

    if boot_choice == 2:
        print("\n--- LIVE DATA INGESTION ---")
        days = 50
        print(f"Fetching the last {days} days of market data from Yahoo Finance...")
        
        # FIX 1: The correct ticker
        target_stocks = [
            'AAPL', 'TSLA','RELIANCE.NS', 'TCS.NS', 'INFY.NS', 'HDFCBANK.NS', 
            'ICICIBANK.NS', 'ITC.NS', 'BHARTIARTL.NS', 'LT.NS', 
            'HINDUNILVR.NS', 'SBIN.NS'
        ]
        pipeline = ETLPipeline(symbols=target_stocks, days=days)
        success = pipeline.run()
        
        if success:
            print("\n New data extracted! Running ETL & Cleaning pipeline...")
            
            # FIX 2: Chronological execution order!
            services.data_cleaning_services.import_tranform_load() # <-- MUST CLEAN FIRST!
            sql.update_sql_data_insertion.update_insert_sql() # <-- THEN GENERATE SQL!
            setup.setup_db.initialize_database() # <-- THEN INSERT TO DB!
            
            print("\n Database fully synchronized with live market data.")
        else:
            print("\n Failed to ingest live data. Booting with existing data...")
            
    # Launch the main menu regardless of which boot option they chose
    main()