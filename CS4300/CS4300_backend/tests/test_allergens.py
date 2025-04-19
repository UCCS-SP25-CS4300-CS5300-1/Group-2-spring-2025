from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from django.test import TestCase, Client
from unittest.mock import patch
from ..models import Allergen
import json

class saveAllergen(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@example.com'
        self.user = User.objects.create_user(username=self.username, password=self.password, email=self.email)
        self.url = reverse("user-allergens")
        # need to create a user for the allergens to work
        # self.client.post(reverse('register'), {
        #     'username': 'newuser',
        #     'password': 'newpassword',
        #     'email': 'newuser@example.com'
        # }, content_type='application/json')
        # self.client.post(reverse('login'), {
        #     'username': self.username,
        #     'password': self.password
        # }, content_type='application/json')
        self.client.force_login(self.user)
        self.crsf = self.client.get(reverse("csrf"))

    def test_saveAllergen(self):
        response = self.client.post(self.url, 
            data='{"allergen": "test"}', 
            headers={"content_type":'application/json', 
            'X-CSRFToken': self.crsf}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_getAllergens(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(response.json())
        self.assertEqual(response.json())


        