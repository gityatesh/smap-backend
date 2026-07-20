#return the http json response for react

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from portfolio.services.services import PortfolioService

class WatchlistView(APIView):
    def get(self, request):
        # 1. Grab all watchlists + live prices
        watchlists = PortfolioService.get_user_watchlists(request.user)
        return Response({"status": "success", "data": watchlists}, status=200)

    def post(self, request):
        # This endpoint will handle TWO jobs based on what React asks for
        action = request.data.get('action')

        # 2A. If React asks to create a new folder:
        if action == 'create_group':
            name = request.data.get('name')
            group, error = PortfolioService.create_watchlist_group(request.user, name)
            if error:
                return Response({"error": error}, status=400)
            return Response({"message": f"Watchlist '{name}' created!", "group_id": group.id}, status=201)

        # 2B. If React asks to add a stock to a folder:
        elif action == 'add_stock':
            group_id = request.data.get('group_id')
            symbol = request.data.get('symbol')
            
            if not group_id or not symbol:
                return Response({"error": "Missing group ID or stock symbol"}, status=400)

            item, error = PortfolioService.add_to_watchlist(request.user, group_id, symbol)
            if error:
                return Response({"error": error}, status=400)
            return Response({"message": f"{symbol} successfully added!"}, status=200)

        return Response({"error": "Invalid action"}, status=400)
    
    def delete(self, request):
        action = request.data.get('action')

        if action == 'delete_group':
            group_id = request.data.get('group_id')
            msg, error = PortfolioService.delete_watchlist_group(request.user, group_id)
            if error:
                return Response({"error": error}, status=400)
            return Response({"message": msg}, status=200)

        elif action == 'remove_stock':
            item_id = request.data.get('item_id')
            msg, error = PortfolioService.remove_from_watchlist(request.user, item_id)
            if error:
                return Response({"error": error}, status=400)
            return Response({"message": msg}, status=200)

        return Response({"error": "Invalid action"}, status=400)

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
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can fetch this data

    def get(self, request):
        user = request.user
        
        # Package the user data to send to React
        profile_data = {
            "username": user.username, #return json username
            "email": user.email, #return json email (if provided)
            "date_joined": user.date_joined.strftime('%B %d, %Y') if user.date_joined else None, #return joining date 
        }
        
        return Response({
            "status": "success",
            "data": profile_data
        }, status=200)