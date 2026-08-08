from django.db import models
from django.conf import settings


class TokenWallet(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='wallet',
        verbose_name='کاربر'
    )
    balance = models.PositiveIntegerField(
        default=50,
        verbose_name='موجودی توکن'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'کیف پول'
        verbose_name_plural = 'کیف پول‌ها'

    def __str__(self):
        return f"کیف پول {self.user} - موجودی: {self.balance} توکن"


class TokenTransaction(models.Model):
    TRANSACTION_TYPES = [
        ('SIGNUP_BONUS', 'هدیه ثبت‌نام'),
        ('SEARCH_CONSUMPTION', 'مصرف سرچ'),
        ('MANUAL_RECHARGE', 'شارژ دستی'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='token_transactions',
        verbose_name='کاربر'
    )
    amount = models.IntegerField(
        verbose_name='مقدار تغییر'
    )
    transaction_type = models.CharField(
        max_length=30,
        choices=TRANSACTION_TYPES,
        verbose_name='نوع تراکنش'
    )
    description = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='توضیحات'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'تراکنش توکن'
        verbose_name_plural = 'تراکنش‌های توکن'
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.amount > 0 else ''
        return f"{self.user} | {sign}{self.amount} | {self.get_transaction_type_display()}"