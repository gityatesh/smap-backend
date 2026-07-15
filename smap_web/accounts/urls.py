from django.urls import path
from . import views

urlpatterns = [
    path('register/',views.RegisterView.as_view(), name= 'auth_register'),
    path('login/',views.CustomTokenObtainPairView.as_view(), name='auth_login'),
    # path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
]

