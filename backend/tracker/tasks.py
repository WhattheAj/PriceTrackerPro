from celery import shared_task
from django.core.mail import send_mail
from tracker.models import ProductWatchlist
from tracker.services import MultiStoreAggregator


@shared_task
def check_watchlist_price_drops():
    active_items = ProductWatchlist.objects.filter(is_active=True).select_related('user')
    alerts_triggered = 0

    for item in active_items:
        search_res = MultiStoreAggregator.search_all(item.title, 1)
        products = search_res.get('products', [])

        matched = None
        for p in products:
            p_id = str(p.get('id') or p.get('raw_id') or '').strip()
            if p_id == str(item.product_id).strip():
                matched = p
                break

        if not matched and products:
            matched = products[0]

        if matched:
            new_price = matched.get('price_toman') or matched.get('price_selling_toman') or 0
            if not new_price and isinstance(matched.get('price'), dict):
                new_price = matched.get('price', {}).get('selling_price', 0)

            if new_price > 0:
                item.current_price = new_price
                item.save(update_fields=['current_price', 'updated_at'])

                if new_price <= item.target_price:
                    alerts_triggered += 1
                    recipient_email = item.user.email if item.user.email else f"{item.user.phone_number}@pricetrackerpro.local"

                    subject = f"🎉 هشدار افت قیمت: {item.title[:40]}"
                    message = (
                        f"سلام {item.user.first_name or 'کاربر'} عزیز،\n\n"
                        f"قیمت محصول «{item.title}» در {item.provider} به قیمت هدف شما رسید!\n\n"
                        f"قیمت جدید: {new_price:,} تومان\n"
                        f"قیمت هدف شما: {item.target_price:,} تومان\n"
                        f"لینک مستقیم خرید: {item.product_url}\n\n"
                        f"با تشکر،\nسیستم پرایس ترکر پرو (PriceTrackerPro)"
                    )

                    send_mail(
                        subject=subject,
                        message=message,
                        from_email='no-reply@pricetrackerpro.com',
                        recipient_list=[recipient_email],
                        fail_silently=True
                    )

    return f"Checked {len(active_items)} watchlist items. Triggered {alerts_triggered} price drop alerts."
