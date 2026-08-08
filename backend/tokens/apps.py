from django.apps import AppConfig


class TokensConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tokens'
    verbose_name = 'مدیریت توکن‌ها'

    def ready(self):
        import tokens.signals
