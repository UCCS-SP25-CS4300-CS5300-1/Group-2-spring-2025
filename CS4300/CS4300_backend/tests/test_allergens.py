import json
from django.urls import reverse
from django.contrib.auth.models import User
from django.test import TestCase, Client
from rest_framework import status
from ..models import Allergen

#pylint: disable=missing-function-docstring
#pylint: disable=redefined-outer-name
#pylint: disable=no-member

class SaveAllergen(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@example.com'
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password,
            email=self.email)
        self.url = reverse("user-allergens")
        self.client.force_login(self.user)
        self.crsf = self.client.get(reverse("csrf"))

    def test_save(self):
        response = self.client.post(
            self.url, {'allergen': 'test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Allergen.objects.filter(user=self.user, allergen='test').exists()
        )
        response = self.client.post(
            self.url, {'nothing': 'test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete(self):
        response = self.client.delete(
            self.url,
            data=json.dumps({'allergen': 'test'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = self.client.delete(
            self.url,
            data=json.dumps({'nothing': 'test'}),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
