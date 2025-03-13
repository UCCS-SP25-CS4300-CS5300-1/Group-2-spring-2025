# File: CS4300/CS4300_backend/tests/test_example_api_view.py

import os
import django
from rest_framework.test import APITestCase
from django.urls import reverse

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ['DJANGO_SETTINGS_MODULE'] = 'CS4300_django_server.settings'
django.setup()

class ExampleApiViewTest(APITestCase):
    def test_example_api_view(self):
        url = reverse('example_api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'message': 'Hello, world!'})