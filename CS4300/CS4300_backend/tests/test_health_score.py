import os
import pytest
from unittest.mock import patch, MagicMock
from ..models import Product

@pytest.fixture
def mock_openai_client():
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content="Health score: 8/10, good balance."))
    ]
    mock_client.chat.completions.create.return_value = mock_response
    return mock_client

@pytest.mark.django_db
@patch('CS4300_backend.models.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_fetch_health_score_works(mock_openai_class):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client

    mock_response = MagicMock()
    mock_response.choices = [MagicMock(message=MagicMock(content="Health score: 8/10, good balance."))]
    mock_client.chat.completions.create.return_value = mock_response

    with patch('CS4300_backend.models.Product.__init__', return_value=None):
        food = Product(barcode="123456789")
        food.name = "Apple"
        food.nutrition_data = "Calories: 100, Carbohydrates: 25g"

        result = food.fetch_health_score()

        assert "health score" in result.lower()
        mock_client.chat.completions.create.assert_called_once()

@pytest.mark.django_db
@patch('CS4300_backend.models.OpenAI')
@patch.dict(os.environ, {'OPENAI_API_KEY': 'fake-key'})
def test_fetch_health_score_fails(mock_openai_class):
    mock_client = MagicMock()
    mock_openai_class.return_value = mock_client
    mock_client.chat.completions.create.side_effect = Exception("API error")

    with patch('CS4300_backend.models.Product.__init__', return_value=None):
        food = Product(barcode="123456789")
        food.name = "Apple"
        food.nutrition_data = "Calories: 100, Carbohydrates: 25g"

        result = food.fetch_health_score()

        assert food.health_score == "Unable to fetch health score"
        assert result is None or "Unable to fetch" in result
