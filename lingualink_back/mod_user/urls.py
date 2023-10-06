from django.urls import path, include
from . import views, profile_views as pf
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns=[
    path('register', views.register_user),
    path('dj-auth/', include('dj_rest_auth.urls')),
    path('dj-auth/registration', include('dj_rest_auth.registration.urls')),
    path('oauth/google/', views.GoogleLogin.as_view()),
    path('validate', views.validate_account),
    path('get-token/', views.obtain_token),
    path('refresh-token/', TokenRefreshView.as_view()),
    path('get-users', views.get_users),
    path('get-users-by-email', views.get_user_email),
    path('get-users-by-username', views.get_user_username),
    path('send-code', views.get_validation_code),
    path('get-reset-code', views.get_code_change_password),
    path('get-authorization-code', views.get_authorization_code),
    path('reset-password', views.change_password_with_code),

    # profile
    path('change_picture', pf.change_profile),
    path('get-profile', pf.get_profile),
    path('update-profile', pf.update_profile),
    path('change-password', pf.change_password),
    path('search-user', pf.search_user),
    path('view-profile/<int:pk>', pf.view_profile)
]