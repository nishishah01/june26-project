from rest_framework.generics import ListAPIView

from .models import Vendor
from .serializers import VendorSerializer


class VendorListView(ListAPIView):

    serializer_class = VendorSerializer

    def get_queryset(self):

        return Vendor.objects.all().order_by(
            "-risk_score"
        )