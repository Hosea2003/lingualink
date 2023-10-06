from django.db import models

from mod_user.models import LinguaUser
from django.utils.translation import gettext_lazy as _

class Subscription(models.Model):

    class SubscriptionType(models.TextChoices):
        MONTHLY = 'MONTHLY', _('MONTHLY')
        YEARLY = 'YEARLY', _('MONTHLY')

    user = models.ForeignKey(LinguaUser, on_delete=models.CASCADE,
                             related_name="subscriptions")
    
    paid_on = models.DateField(auto_now_add=True)
    expired_on=models.DateField()

    subscription_type=models.CharField(max_length=30,
                                       choices=SubscriptionType.choices,
                                       default=SubscriptionType.MONTHLY)
    session_id=models.CharField(max_length=250)

    amount = models.DecimalField(decimal_places=2, max_digits=10)