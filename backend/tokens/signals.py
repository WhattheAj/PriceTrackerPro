from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from tokens.models import TokenWallet, TokenTransaction


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_token_wallet(sender, instance, created, **kwargs):
    if created:
        wallet = TokenWallet.objects.create(user=instance, balance=50)

        TokenTransaction.objects.create(
            user=instance,
            amount=+10,
            transaction_type='SIGNUP_BONUS',
            description=f'هدیه ثبت‌نام برای {instance.first_name} {instance.last_name}'
        )
