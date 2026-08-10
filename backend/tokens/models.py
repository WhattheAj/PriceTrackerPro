from django.db import models
from django.conf import settings


class TokenWallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wallet',
        verbose_name='User'
    )
    balance = models.PositiveIntegerField(
        default=10,
        verbose_name='Token Balance'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Token Wallet'
        verbose_name_plural = 'Token Wallets'

    def __str__(self):
        return f"Wallet for {self.user} - Balance: {self.balance} Tokens"


class TokenTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('SIGNUP_BONUS', 'Signup Bonus'),
        ('SEARCH_CONSUMPTION', 'Search Consumption'),
        ('MANUAL_RECHARGE', 'Manual Recharge'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='token_transactions',
        verbose_name='User'
    )
    amount = models.IntegerField(
        verbose_name='Amount Change'
    )
    transaction_type = models.CharField(
        max_length=30,
        choices=TRANSACTION_TYPES,
        verbose_name='Transaction Type'
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Description'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Token Transaction'
        verbose_name_plural = 'Token Transactions'
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.amount > 0 else ''
        return f"{self.user} | {sign}{self.amount} | {self.get_transaction_type_display()}"