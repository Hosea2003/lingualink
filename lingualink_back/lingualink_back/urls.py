from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('mod_user.urls')),
    path('accounts/', include('allauth.urls')),
    path('room/', include('mod_space.urls')),
    path('payments/', include('payments.urls')),
    path('organization/', include('mod_organization.urls')),
    path('message/', include('messaging.urls'))
]+static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)