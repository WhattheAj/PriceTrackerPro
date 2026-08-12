from django.db import models
from django.conf import settings


class SearchLog(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='search_logs',
        verbose_name='User'
    )
    query = models.CharField(
        max_length=255,
        verbose_name='Search Query'
    )
    result_count = models.IntegerField(
        default=0,
        verbose_name='Result Count'
    )
    tokens_used = models.PositiveIntegerField(
        default=1,
        verbose_name='Tokens Used'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Search Log'
        verbose_name_plural = 'Search Logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} | {self.query} | {self.result_count} items"


class ProductWatchlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='watchlist_items',
        verbose_name='User'
    )
    product_id = models.CharField(
        max_length=255,
        verbose_name='Product ID'
    )
    title = models.CharField(
        max_length=500,
        verbose_name='Product Title'
    )
    provider = models.CharField(
        max_length=100,
        verbose_name='Provider Store'
    )
    current_price = models.PositiveBigIntegerField(
        default=0,
        verbose_name='Current Price Toman'
    )
    target_price = models.PositiveBigIntegerField(
        verbose_name='Target Price Toman'
    )
    product_url = models.URLField(
        max_length=1000,
        verbose_name='Product URL'
    )
    image_url = models.URLField(
        max_length=1000,
        blank=True,
        null=True,
        verbose_name='Image URL'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Is Active Alert'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Product Watchlist'
        verbose_name_plural = 'Product Watchlists'
        ordering = ['-created_at']
        unique_together = ('user', 'product_id', 'provider')

    def __str__(self):
        return f"{self.user} | {self.title[:30]} | Target: {self.target_price}"
