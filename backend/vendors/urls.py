from django.urls import path

from .views import (
    VendorListView,
    VendorDetailView
)

urlpatterns = [

    path('', VendorListView.as_view()),
    path('<str:vendor_name>/',VendorDetailView.as_view()),
]