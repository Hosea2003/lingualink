from django.db import models
from api.utils import upload_to
from django.utils import timezone
from mod_user.models import LinguaUser
import string
import random

def upload_picture(instance, filename):
    return upload_to("organization_pf")(instance, filename)

class Organization(models.Model):
    admin = models.ForeignKey(LinguaUser, on_delete=models.CASCADE, related_name='organizations')
    name = models.CharField(max_length=50)
    picture = models.ImageField(
        blank=True,
        null=True,
        upload_to=upload_picture
    )
    created_at = models.DateField(auto_now_add=True)
    slug=models.CharField(max_length=7)

    def __str__(self) -> str:
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.pk:
            letters = string.ascii_letters
            self.slug = ''.join(random.choice(letters) for i in range(7))
        super().save(*args, **kwargs)

class OrganizationMember(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,
                                     related_name='members')
    user = models.ForeignKey(LinguaUser, on_delete=models.CASCADE)

class OrganizationInvitation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,
                                     related_name='invitations')
    invited_user = models.ForeignKey(LinguaUser, on_delete=models.CASCADE)
    invited_on=models.DateTimeField(default=timezone.now)