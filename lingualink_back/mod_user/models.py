from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.translation import gettext_lazy as _
from datetime import date
from django.utils import timezone
from uuid import uuid4
import os
from django.conf import settings

from api.utils import upload_to


class LinguaUserManager(UserManager):
    use_in_migrations = True

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError("Please provide email")

        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            password=password,
            **extra_fields
        )
        user.set_password(password)

        user.save()

        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("birthdate", date.today())
        extra_fields.setdefault("account_verified", True)
        user = self.create_user(username, email, password, **extra_fields)

        return user


class LinguaUser(AbstractUser):
    class GenderChoice(models.TextChoices):
        MALE = 'MALE', _('MALE')
        FEMALE = 'FEMALE', _('FEMALE')

    birthdate = models.DateField(null=True)
    gender = models.CharField(
        max_length=20,
        choices=GenderChoice.choices,
        default=GenderChoice.MALE
    )

    # if the email is verified
    account_verified = models.BooleanField(default=False)

    objects = LinguaUserManager()

    class Meta:
        db_table = 'LINGUA_USER'
        db_table_comment = 'user used for lingualink app'

    def save(self, *args, **kwargs):
        if not self.pk:
            self.set_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return "%s %s"%(self.username, str(self.id))
    
    @property
    def profile_picture(self):
        pf = self.pictures.filter(is_current=True)
        if not pf.first():
            return None
        return settings.MEDIA_URL+str(pf.first().image_url)

class ValidationCode(models.Model):
    code = models.CharField(max_length=7)
    created_at = models.DateTimeField(default=timezone.now)
    expire_at = models.DateTimeField()
    user_to_validate = models.ForeignKey(LinguaUser, on_delete=models.CASCADE, related_name='code_validation')

def upload_pdp(instance, filename):
    return upload_to("pf")(instance, filename)

class ProfilePicture(models.Model):
    image_url = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_pdp
    )
    owner = models.ForeignKey(
        LinguaUser, on_delete=models.CASCADE, related_name="pictures")
    created_at = models.DateTimeField(default=timezone.now)
    is_current = models.BooleanField(default=True)

class AuthorizationCode(models.Model):
    user=models.ForeignKey(LinguaUser, on_delete=models.CASCADE)
    code = models.CharField(max_length=250, unique=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            while True:
                self.code = str(uuid4()).replace('-', '')
                if not AuthorizationCode.objects.filter(code=self.code).first():
                    break
        super().save(*args, **kwargs)    