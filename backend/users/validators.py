import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_phone_number(value):
    phone = str(value).strip()
    if not re.match(r'^09\d{9}$', phone):
        raise ValidationError(
            _('شماره تلفن وارد شده معتبر نیست. (مثال صحیح: 09123456789)'),
            code='invalid_phone_number'
        )
    return phone
