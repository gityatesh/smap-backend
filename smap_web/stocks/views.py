from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Max, Min
from stocks.models import Stock, StockPrice
# Create your views here.

#get/stocks
def get_stocks(request):
    '''fetches all the stock and return it in JSON fromat.'''
    stocks = Stock.objects.all()
    data=[]
    for stock in stocks:
        data.append({
            'Symbol':stock.symbol,
            "Company_name": stock.company_name
        })
    return JsonResponse(data,  safe=False)#return list instead of dict

def get_desired_stock(request, symbol):
    '''fetches only a specific required stock'''
    try:
        stock = Stock.objects.get(symbol = symbol.upper())
        data = {
            'Symbol':stock.symbol,
            "Company_name": stock.company_name,
            'sector':stock.sector,
            'market cap': stock.market_cap,
            'source': stock.source.name if stock.source else '-'
        }
        return JsonResponse(data)
    except Stock.DoesNotExist:
        return JsonResponse({'error': f'stock {symbol} not found!'})

#price details of a stock    
def get_stock_prices(request, symbol):
    try:
        stock = Stock.objects.get(symbol = symbol.upper())
        prices = StockPrice.objects.filter(stock = stock).order_by('-trade_date')
        
        data=[]
        for price in prices:
            data = [{
                'Date':price.trade_date,
                "open_price": price.open_price,
                "high_price": price.high_price,
                "low_price": price.low_price,
                "close_price": price.close_price,
                "volume": price.volume
            }]
        return JsonResponse(data, safe=False)
    
    except stock.DoesNotExist:
        return JsonResponse({"error": f"Stock '{symbol}' not found."}, status=404)
    
#getting the market summary
def get_market_summary(request):
    stats = StockPrice.objects.aggregate(
        latest_date = Max('trade_date'),
        highest_closing_price = Max('close_price'),
        lowest_closing_price = Min('close_price')
    )
    
    data = {
        "total_stocks": Stock.objects.count(),
        "total_price_records": StockPrice.objects.count(),
        "latest_trading_date": stats['latest_date'],
        "highest_closing_price": stats['highest_closing_price'],
        "lowest_closing_price": stats['lowest_closing_price']
    }
    return JsonResponse(data)

# gets the top 5 stocks (close_price)
def get_top_stocks(request):
    max_date = StockPrice.objects.aggregate(Max('trade_date'))
    absolute_latest_date=  max_date['trade_date__max']
    '''absolute_max_tradedate is needed because aggregate automatically generates the dicts
    with __max as the key. We only need the value not the whole dict'''
    if not absolute_latest_date:
        return JsonResponse({'error: no price data available'}, status=404)
        
    top_stocks = StockPrice.objects.filter(trade_date = absolute_latest_date).order_by('-close_price')[:5]
    data=[]
    for s in top_stocks:
        data.append({
            'Symbol':s.stock.symbol,
            'Close Price':s.close_price,
            'Date':s.trade_date
        })
        
    return JsonResponse(data, safe=False)