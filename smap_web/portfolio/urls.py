from django.urls import path
from .views import TransactionView,WatchlistView,PortfolioSummaryView

urlpatterns = [
    path('watchlist/', WatchlistView.as_view(), name = 'watchlist'),
    path('trade/', TransactionView.as_view(), name='trade'),
    path('summary/', PortfolioSummaryView.as_view(), name='portfolio_summary'),
]