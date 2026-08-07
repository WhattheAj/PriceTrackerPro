from django.contrib.auth.models import AbstractUser
from django.db import models

from users.managers import CustomUserManager


# Create your models here.
class CustomUser(AbstractUser):
    username = None
    phone_number = models.CharField(max_length=11, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone_number})"