"""
module docstring
"""
import os
from unittest.mock import patch, MagicMock
import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from dotenv import load_dotenv

load_dotenv()

#pylint: disable=missing-function-docstring
#pylint: disable=redefined-outer-name
@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def mock_openai_client():
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content="8.0/10"))
    ]
    mock_client.chat.completions.create.return_value = mock_response
    return mock_client


@pytest.mark.django_db
@patch('CS4300_backend.views.openai.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_health_score_view_success(mock_openai_class, api_client):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="8.0/10"))]
    mock_client.chat.completions.create.return_value = mock_response

    url = reverse('health_score')
    data = {
        "name": "Apple",
        "nutrition_data": "Calories: 100, Carbohydrates: 25g"
    }

    response = api_client.post(url, data, format='json')

    assert response.status_code == 200
    assert response.data["health_score"] == "8.0/10"
    mock_client.chat.completions.create.assert_called_once()


@pytest.mark.django_db
@patch('CS4300_backend.views.openai.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_health_score_view_failure(mock_openai_class, api_client):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client
    mock_client.chat.completions.create.side_effect = Exception("API error")

    url = reverse('health_score')
    data = {
        "name": "Apple",
        "nutrition_data": "Calories: 100, Carbohydrates: 25g"
    }

    response = api_client.post(url, data, format='json')

    assert response.status_code == 500
    assert "error" in response.data
    assert "API error" in response.data["error"]


@pytest.mark.django_db
@patch('CS4300_backend.views.openai.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_health_summary_view_success(mock_openai_class, api_client):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(
            message=MagicMock(
                content="This is a healthy product with balanced nutrition."))]
    mock_client.chat.completions.create.return_value = mock_response

    url = reverse('health_summary')
    data = {
        "name": "Apple",
        "nutrition_data": "Calories: 100, Carbohydrates: 25g"
    }

    response = api_client.post(url, data, format='json')

    assert response.status_code == 200
    #pylint: disable=line-too-long
    #shut up, it is 4 characters too long
    assert response.data["health_score_summary"] == "This is a healthy product with balanced nutrition."
    mock_client.chat.completions.create.assert_called_once()


@pytest.mark.django_db
@patch('CS4300_backend.views.openai.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_health_summary_view_failure(mock_openai_class, api_client):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client
    mock_client.chat.completions.create.side_effect = Exception("API error")

    url = reverse('health_summary')
    data = {
        "name": "Apple",
        "nutrition_data": "Calories: 100, Carbohydrates: 25g"
    }

    response = api_client.post(url, data, format='json')

    assert response.status_code == 500
    assert "error" in response.data
    assert "API error" in response.data["error"]
