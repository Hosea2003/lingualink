from datetime import datetime
from uuid import uuid4

from django.conf import settings
from django.utils import timezone
from rest_framework import status

from mod_user.models import LinguaUser, ValidationCode
from mod_user.serializers import ValidateUserSerializer
from django.db.models  import Q


def create_code(user:LinguaUser):
    code = str(uuid4().int)[:7]
    expiration = timezone.now() + settings.VALIDATION_CODE_EXPIRATION
    validation_code = ValidationCode.objects.create(
        code=code,
        expire_at=expiration,
        user_to_validate=user
    )

    return validation_code

def check_validation_code(data):
    serializer = ValidateUserSerializer(data=data)
    if not serializer.is_valid():
        return {"message":"Fill all the fields", 'status':status.HTTP_400_BAD_REQUEST}

    user_code = ValidationCode.objects.filter(
        Q(user_to_validate__username=data.get('username'))|Q(user_to_validate__email=data.get('email'))
    ).filter(code=data.get('code')).first()
    if not user_code:
        return {"message":"Code not found", 'status':status.HTTP_404_NOT_FOUND}
    now = datetime.now()
    #     if code expired
    if timezone.make_aware(now) >= user_code.expire_at:
        user_code.delete()
        return {"message":"Code expired", 'status':status.HTTP_400_BAD_REQUEST}

    return {"message":user_code, 'success':True}

