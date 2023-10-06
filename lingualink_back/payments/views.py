from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from django.db.models import Sum

import stripe

from payments.models import Subscription
from payments.serializers import SubscriptionSerializer
# This is your test secret API key.
stripe.api_key = settings.STRIPE_SECRET_KEY
class StripeView(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        data = request.data
        price_id = data.get('price_id')
        subscription_type=str(data.get('subscription_type'))
        amount = str(data.get('amount'))
        
        try:

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        # Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=settings.SITE_URL +'/pricing/create-session?success=true&session_id={CHECKOUT_SESSION_ID}&subscription_type='+subscription_type+
                '&amount='+amount,
                cancel_url=settings.SITE_URL + '/pricing/create-session?canceled=true',
            )
        except Exception as e:
            return Response({
                'error':'Something went wrong when creating stripe checkout'
            },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(checkout_session.url)
    
class PriceView(APIView):
    def get(self, request):
        products = stripe.Product.list()
        result=[]

        for product in products["data"]:
            prices=stripe.Price.list(product=product["id"])
            _product={
                "name":product["name"],
                "id":product["id"],
                "prices":prices["data"]
            }
            result.append(_product)

        return Response(result[::-1])
    
class RegisterPayment(APIView):
    permission_classes=[IsAuthenticated]
    def post(self, request):
        user = request.user
        session_id=request.data.get("session_id")
        subscription_type=str(request.data.get("subscription_type")).upper()
        amount=request.data.get('amount')

        today = date.today()
        expire=today+timedelta(days=30) if subscription_type==Subscription.SubscriptionType.MONTHLY else today+timedelta(days=365)
        subscription=Subscription.objects.create(
            user=user,
            expired_on=expire,
            subscription_type=subscription_type,
            session_id=session_id,
            amount=amount
        )

        return Response(SubscriptionSerializer(subscription).data)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def view_billing(request:Request):
    user=request.user
    payments = user.subscriptions.all().order_by("-id")
    sum =user.subscriptions.all().aggregate(
        Sum("amount")
    )

    return Response({
        "data":SubscriptionSerializer(payments, many=True).data,
        "total":sum["amount__sum"]
    })