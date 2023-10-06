from .views import *
from django.urls import path

urlpatterns=[
    path('create-checkout-session', StripeView.as_view()),
    path('products-list', PriceView.as_view()),
    path('successfull-payment', RegisterPayment.as_view()),
    path('billing', view_billing)
]