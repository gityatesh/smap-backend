from django.urls import path
from . import views

urlpatterns = [
    path('stocks/', views.get_stocks, name='all-stocks'),
    path('stocks/<str:symbol>/', views.get_desired_stock, name='stock-detail'),
    path('stocks/<str:symbol>/prices/', views.get_stock_prices, name = 'stock-prices'),
    path('market-summary/', views.get_market_summary, name='market-summary'),
    path('top-stocks/',views.get_top_stocks, name='top-stocks'),
    path('etl/trigger/', views.TriggerETLView.as_view(), name='trigger-etl'),
]
