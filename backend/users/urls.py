from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from users.views import RegisterView, CustomTokenObtainPairView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='auth_token_refresh'),
]
