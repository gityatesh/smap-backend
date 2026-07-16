#return the http json response for react

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from portfolio.services.services import PortfolioService

class WatchlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PortfolioService.get_watchlist(request.user)
        return Response({
            "status": "success",
            "message": "Watchlist retrieved successfully",
            "data": data,
            "error": None
        }, status=status.HTTP_200_OK)

    def post(self, request):
        symbol = request.data.get('symbol')
        if not symbol:
            return Response({"error": "Stock symbol is required"}, status=400)
        result, error = PortfolioService.add_to_watchlist(request.user, symbol)
        
        if error:
            return Response({
                "status": "error",
                "message": error,
                "data": None,
                "error": error
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "status": "success",
            "message": "Stock added to watchlist successfully",
            "data": result,
            "error": None
        }, status=status.HTTP_201_CREATED)

class TransactionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        symbol = request.data.get('symbol')
        quantity = request.data.get('quantity')
        action = request.data.get('transaction_type')

        result, error = PortfolioService.execute_trade(
            user=request.user,
            symbol=symbol,
            transaction_type=action,
            quantity=quantity
        )

        if error:
            return Response({
                "status": "error",
                "message": error,
                "data": None,
                "error": error
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "status": "success",
            "message": "Trade executed successfully",
            "data": result,
            "error": None
        }, status=status.HTTP_201_CREATED)

class PortfolioSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = PortfolioService.get_portfolio_summary(request.user)
        return Response({
            "status": "success",
            "message": "Portfolio summary calculated successfully",
            "data": data,
            "error": None
        }, status=status.HTTP_200_OK)
        
class WalletView(APIView):
    def get(self, request):
        try:
            # Grab the exact live balance from the database
            balance = request.user.investor_profile.available_cash
            return Response({"available_cash": float(balance)})
        except Exception:
            return Response({"available_cash": 0.0})