from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model
from users.validators import validate_phone_number

User = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):

    phone_number = serializers.CharField(
        required=True,
        allow_blank=False,
        validators=[
            validate_phone_number,
            UniqueValidator(
                queryset=User.objects.all(),
                message='کاربری با این شماره تلفن قبلاً ثبت‌نام کرده است.'
            )
        ]
    )
    email = serializers.EmailField(
        required=False,
        allow_blank=True,
        allow_null=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message='کاربری با این پست الکترونیک (ایمیل) قبلاً ثبت‌نام کرده است.'
            )
        ]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=4,
        error_messages={'min_length': 'رمز عبور باید حداقل ۴ کاراکتر باشد.'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('phone_number', 'first_name', 'last_name', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False},
        }

    def validate(self, attrs):

        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'رمز عبور و تکرار آن یکسان نیستند.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        email = validated_data.get('email', '')
        user = User.objects.create_user(
            phone_number=validated_data['phone_number'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=email
        )
        return user
