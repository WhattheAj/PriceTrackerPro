from rest_framework import serializers
from tracker.models import ProductWatchlist


class ProductWatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductWatchlist
        fields = (
            'id',
            'product_id',
            'title',
            'provider',
            'current_price',
            'target_price',
            'product_url',
            'image_url',
            'is_active',
            'created_at',
            'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_target_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('قیمت هدف باید بزرگتر از صفر باشد.')
        return value
