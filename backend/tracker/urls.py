from django.urls import path
from tracker.views import ProductSearchView, TokenBalanceView, ExportCSVView, SearchHistoryView

urlpatterns = [
    path('search/', ProductSearchView.as_view(), name='product-search'),
    path('search/history/', SearchHistoryView.as_view(), name='search-history'),
    path('wallet/balance/', TokenBalanceView.as_view(), name='token-balance'),
    path('export-csv/', ExportCSVView.as_view(), name='export-csv'),
]
