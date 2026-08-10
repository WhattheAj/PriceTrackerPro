import csv
from django.http import HttpResponse
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from tokens.models import TokenWallet, TokenTransaction
from tracker.models import SearchLog
from tracker.services import MultiStoreAggregator


class ProductSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get('query', '').strip()
        page = int(request.data.get('page', 1))

        if not query:
            return Response(
                {"error": "Query parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            wallet, created = TokenWallet.objects.select_for_update().get_or_create(
                user=request.user,
                defaults={'balance': 10}
            )

            if created:
                TokenTransaction.objects.create(
                    user=request.user,
                    amount=10,
                    transaction_type='SIGNUP_BONUS',
                    description=f"Signup bonus (+10 tokens) for {request.user.first_name} {request.user.last_name}"
                )

            if wallet.balance < 1:
                return Response(
                    {
                        "error": "توکن حساب شما به اتمام رسیده.لطفا توکن خود را شارژ کنید.",
                        "tokens_remaining": wallet.balance
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            search_result = MultiStoreAggregator.search_all(query, page)

            if not search_result.get("success"):
                return Response(
                    {"error": "اطلاعاتی در دسترس نیست."},
                    status=status.HTTP_502_BAD_GATEWAY
                )

            wallet.balance -= 1
            wallet.save()

            TokenTransaction.objects.create(
                user=request.user,
                amount=-1,
                transaction_type='SEARCH_CONSUMPTION',
                description=f"Search for query: {query}"
            )

            SearchLog.objects.create(
                user=request.user,
                query=query,
                result_count=len(search_result.get("products", [])),
                tokens_used=1
            )

            return Response({
                "query": query,
                "products": search_result.get("products", []),
                "results": search_result.get("products", []),
                "total_items": search_result.get("total_items", 0),
                "total_pages": search_result.get("total_pages", 1),
                "current_page": page,
                "tokens_remaining": wallet.balance
            }, status=status.HTTP_200_OK)


class TokenBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        wallet, created = TokenWallet.objects.get_or_create(
            user=request.user,
            defaults={'balance': 10}
        )
        if created:
            TokenTransaction.objects.create(
                user=request.user,
                amount=10,
                transaction_type='SIGNUP_BONUS',
                description=f"Signup bonus (+10 tokens) for {request.user.first_name} {request.user.last_name}"
            )
        return Response({
            "tokens_remaining": wallet.balance
        }, status=status.HTTP_200_OK)


class ExportCSVView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        products = request.data.get('products', [])

        response = HttpResponse(
            content_type='text/csv; charset=utf-8-sig',
            headers={'Content-Disposition': 'attachment; filename="products.csv"'},
        )

        writer = csv.writer(response)
        writer.writerow([
            'شناسه',
            'نام محصول',
            'فروشگاه',
            'قیمت (تومان)',
            'قیمت اصلی (تومان)',
            'درصد تخفیف',
            'وضعیت موجودی',
            'لینک محصول'
        ])

        for item in products:
            title = item.get('title') or item.get('title_fa') or ''
            store = item.get('provider') or item.get('store_name') or item.get('seller') or 'فروشگاه'
            
            p_price = item.get('price_toman') or item.get('price_selling_toman') or 0
            if not p_price and isinstance(item.get('price'), dict):
                p_price = item.get('price', {}).get('selling_price', 0)
            elif not p_price and isinstance(item.get('price'), (int, float)):
                p_price = int(item.get('price')) // 10 if item.get('price') > 1000000 else item.get('price')

            p_rrp = item.get('rrp_price_toman') or item.get('price_rrp_toman') or 0
            if not p_rrp and isinstance(item.get('price'), dict):
                p_rrp = item.get('price', {}).get('rrp_price', 0)

            discount = item.get('offer') or item.get('discount_percent') or 0
            if not discount and isinstance(item.get('price'), dict):
                discount = item.get('price', {}).get('discount_percent', 0)

            is_stock = item.get('is_in_stock')
            if is_stock is None and item.get('status'):
                is_stock = item.get('status') == 'marketable'
            stock_str = 'موجود' if is_stock else 'ناموجود'

            link = item.get('link') or item.get('product_url') or item.get('url') or ''

            writer.writerow([
                item.get('id', ''),
                title,
                store,
                p_price,
                p_rrp,
                f"{discount}%" if discount else "0%",
                stock_str,
                link
            ])

        return response


class SearchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logs = SearchLog.objects.filter(user=request.user).order_by('-created_at')[:50]
        data = [
            {
                "id": str(log.id),
                "query": log.query,
                "resultCount": log.result_count,
                "tokensUsed": log.tokens_used,
                "timestamp": log.created_at.isoformat()
            }
            for log in logs
        ]
        return Response(data, status=status.HTTP_200_OK)