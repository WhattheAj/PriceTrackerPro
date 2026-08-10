from django.contrib import admin
from tracker.models import SearchLog


@admin.register(SearchLog)
class SearchLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'query', 'result_count', 'tokens_used', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__phone_number', 'user__first_name', 'user__last_name', 'query')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
