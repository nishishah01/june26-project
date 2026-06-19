from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/vendors/',include('vendors.urls')),
    path('api/dashboard/',include('dashboard.urls')),
    path('api/alerts/',include('alerts.urls')),
    
]