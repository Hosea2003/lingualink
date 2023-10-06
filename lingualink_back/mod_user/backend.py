from django.contrib.auth.backends import BaseBackend
from django.db.models import Q
from django.contrib.auth.hashers import check_password

from mod_user.models import LinguaUser


class LinguaBaseBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = LinguaUser.objects.get(Q(username=username)|Q(email=username))
            if user.check_password(password):
                return user
            return None
        except LinguaUser.DoesNotExist:
            return None

        return None

    def get_user(self, user_id):
        try:
            return LinguaUser.objects.get(pk=user_id)
        except LinguaUser.DoesNotExist:
            return None
