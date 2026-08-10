from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.conf import settings
from tokens.models import TokenWallet, TokenTransaction


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_token_wallet(sender, instance, created, **kwargs):
    if created:
        wallet = TokenWallet.objects.create(user=instance, balance=10)

        TokenTransaction.objects.create(
            user=instance,
            amount=10,
            transaction_type='SIGNUP_BONUS',
            description=f'Signup bonus (+10 tokens) for {instance.first_name} {instance.last_name}'
        )


@receiver(pre_save, sender=TokenWallet)
def track_wallet_manual_recharge(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_wallet = TokenWallet.objects.get(pk=instance.pk)
            diff = instance.balance - old_wallet.balance
            if diff != 0:
                TokenTransaction.objects.create(
                    user=instance.user,
                    amount=diff,
                    transaction_type='MANUAL_RECHARGE',
                    description=f'Manual admin balance update ({"+" if diff > 0 else ""}{diff} tokens)'
                )
        except TokenWallet.DoesNotExist:
            pass
