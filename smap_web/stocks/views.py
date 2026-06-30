from django.http import JsonResponse
from stocks.services.stock_service import StockService

#STANDARDIZED API RESPONSE
def standard_response(status = 'success', message = '', data = None, errors = None, status_code = 200):
    """Ensures every single API returns the exact same dictionary structure."""
    payload = {
        'status':status,
        'message':message,
        'data':data,
        'error':errors
    }
    return JsonResponse(payload, status = status_code)


# The Views (waiters)
def get_stocks(request):
    search_query = request.GET.get('request')
    
    stock, error = StockService.get_all_stocks(search_query=search_query)
    return standard_response(
        message='Data Retrieved!',
        data=stock
    )
    
def get_desired_stock(request, symbol):
    data, error = StockService.get_stock_profile(symbol=symbol)
    if error:
        return standard_response(
            status='error',
            errors=error,
            status_code=404
        )
    return standard_response(
        message=f'Stock profile for {symbol} fetched successfully',
        data=data
    )
    
def get_stock_prices(request, symbol):
    """Price details of a stock with pagination."""
    page_number = request.GET.get('page', 1)
    data, error = StockService.get_stock_prices(symbol=symbol, page_number=page_number)
    if error:
        return standard_response(
            status='error',
            errors=error,
            status_code=404
        )
    return standard_response(
        message=f'Price details for {symbol} fetched successfully',
        data=data
    )
     
def get_market_summary(request):
    data, error = StockService.get_market_summary()
    return standard_response(
        message='Summary fetched successfully!',
        data=data
    )

def get_top_stocks(request,limit=5):
    data, error = StockService.get_top_stocks()
    if error:
        return standard_response(status="error", 
                                 errors=error, 
                                 status_code=404)
    return standard_response(
        message=f'Successfully fetched top {limit} stocks',
        data = data
    )