from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from django.test import TestCase, Client
from unittest.mock import patch
from ..models import Allergen

class saveAllergen(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@example.com'
        self.user = User.objects.create_user(username=self.username, password=self.password, email=self.email)
        self.url = reverse("add-allergen")

    def test_saveAllergen(self):
        response = self.client.post(self.url, {
            'allergen': "test"
        }, headers={"content_type":'application/json',})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_getAllergens

        