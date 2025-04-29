# tests/test_views.py
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

from ..models import ScannedItem


class SaveScannedItemViewTests(APITestCase):
    def setUp(self):
        # Create and authenticate a test user
        self.user = User.objects.create_user(
            username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        self.url = reverse('save-scanned-item')

    def test_create_scanned_item_success(self):
        # Patch Product.__init__ to set attributes without calling external API
        # logic
        def fake_init(self, barcode):
            self.barcode = barcode
            self.name = "Test Product"

        # Patch Product.__init__ in the view module so that SaveScannedItemView
        # uses our dummy initializer
        with patch('CS4300_backend.views.Product.__init__', new=fake_init):
            # Also patch fetch_nutrition_data to do nothing
            with patch('CS4300_backend.views.Product.fetch_nutrition_data', return_value=None):
                data = {'barcode': '123456789'}
                response = self.client.post(self.url, data, format='json')
                self.assertEqual(response.status_code, status.HTTP_201_CREATED)
                self.assertEqual(response.data['name'], "Test Product")
                # Verify that the scanned item is created in the database.
                self.assertEqual(ScannedItem.objects.count(), 1)

    def test_create_scanned_item_no_barcode(self):
        # Test that a missing barcode leads to a 400 error response
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('No barcode provided', response.data.get('error', ''))


class UserScannedItemsViewTests(APITestCase):
    def setUp(self):
        # Create and authenticate a test user
        self.user = User.objects.create_user(
            username="testuser", password="password")
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('user-scanned-items')
        # Create two scanned items for the user
        self.item1 = ScannedItem.objects.create(
            user=self.user, barcode='111', name='Item1', favorite=False
        )
        self.item2 = ScannedItem.objects.create(
            user=self.user, barcode='222', name='Item2', favorite=False
        )

    def test_get_scanned_items(self):
        # Issue a GET request to the user-scanned-items endpoint
        response = self.client.get(self.list_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Ensure that both items appear in the returned list
        self.assertEqual(len(response.data), 2)

    def test_delete_scanned_item(self):
        # Issue a DELETE request to remove the first scanned item
        detail_url = reverse(
            'scanned-item-detail',
            kwargs={
                'pk': self.item1.pk})
        response = self.client.delete(detail_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Ensure the item was deleted from the database
        self.assertFalse(ScannedItem.objects.filter(pk=self.item1.pk).exists())

    def test_patch_scanned_item_toggle_favorite(self):
        # Toggle the favorite flag using a PATCH request
        detail_url = reverse(
            'scanned-item-detail',
            kwargs={
                'pk': self.item2.pk})
        # Initially favorite is False; set it to True
        response = self.client.patch(
            detail_url, {'favorite': True}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Refresh instance from database to check updated favorite value
        self.item2.refresh_from_db()
        self.assertTrue(self.item2.favorite)
        self.assertEqual(response.data.get('favorite'), True)
