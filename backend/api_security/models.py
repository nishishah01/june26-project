from django.db import models

class APIAsset(models.Model):
    endpoint = models.CharField(max_length=255)

    auth = models.BooleanField(default=True)

    tls = models.BooleanField(default=True)

    owner = models.CharField(max_length=100)

    status = models.CharField(max_length=50)

    last_used = models.DateField()

    risk_score = models.FloatField(default=0)





