from rest_framework import generics, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from users.serializers import UserRegisterSerializer, CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [permissions.AllowAny]