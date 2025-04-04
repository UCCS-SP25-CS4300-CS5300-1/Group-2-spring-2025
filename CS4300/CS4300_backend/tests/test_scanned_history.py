import pytest
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User
from ..models import ScannedItem
from rest_framework.test import APIClient

@pytest.fixture
def client():
    client = APIClient()
    user = User.objects.create_user(username='testuser', password='testpassword')
    client.login(username='testuser', password='testpassword')
    return client

@pytest.fixture
def scanned_item(client):
    user = User.objects.get(username='testuser')
    return ScannedItem.objects.create(user=user, barcode='123456789', name='Test Item')

@pytest.mark.django_db
def test_mark_item_as_favorite(client, scanned_item):
    url = reverse('scanned-item-detail', args=[scanned_item.id])
    data = {'favorite': True}
    response = client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    scanned_item.refresh_from_db()
    assert scanned_item.favorite

@pytest.mark.django_db
def test_mark_item_as_unfavorite(client, scanned_item):
    scanned_item.favorite = True
    scanned_item.save()
    url = reverse('scanned-item-detail', args=[scanned_item.id])
    data = {'favorite': False}
    response = client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    scanned_item.refresh_from_db()
    assert not scanned_item.favorite

@pytest.mark.django_db
def test_delete_existing_scanned_item(client, scanned_item):
    url = reverse('scanned-item-detail', args=[scanned_item.id])
    response = client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not ScannedItem.objects.filter(id=scanned_item.id).exists()

@pytest.mark.django_db
def test_delete_nonexistent_scanned_item(client):
    url = reverse('scanned-item-detail', args=[999])
    response = client.delete(url)
    assert response.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.django_db
def test_mark_nonexistent_item_as_favorite(client):
    url = reverse('scanned-item-detail', args=[999])
    data = {'favorite': True}
    response = client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_404_NOT_FOUND