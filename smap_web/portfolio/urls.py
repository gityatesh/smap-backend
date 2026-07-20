from django.urls import path
from .views import TransactionView,PortfolioSummaryView, WalletView, WatchlistView, UserProfileView

urlpatterns = [
    path('watchlist/', WatchlistView.as_view(), name = 'watchlist'),
    path('trade/', TransactionView.as_view(), name='trade'),
    path('summary/', PortfolioSummaryView.as_view(), name='portfolio_summary'),
    path('wallet/', WalletView.as_view(), name='wallet'),
    path('profile/', UserProfileView.as_view(), name = 'profile'),
]