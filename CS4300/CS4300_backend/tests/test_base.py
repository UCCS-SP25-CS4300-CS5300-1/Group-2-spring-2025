from django.core.management import call_command
from rest_framework.test import APITestCase

class BaseTestCase(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        call_command('migrate', verbosity=0)
