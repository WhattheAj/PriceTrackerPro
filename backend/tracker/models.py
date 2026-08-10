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
