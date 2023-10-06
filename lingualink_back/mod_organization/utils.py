from django.http import HttpResponse

from mod_organization.models import Organization

def organization_admin(func):
    def wrapper(request, *args, **kwargs):
        user = request.user
        pk = kwargs.get("pk")
        organization = Organization.objects.filter(admin = user, pk=pk)
        if not organization:
            return HttpResponse("You are not the owner", status=401)
        return func(request, *args, **kwargs)

    return wrapper