from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.urls import reverse


class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.username = 'testuser'
        self.password = 'testpassword'
        self.email = 'testuser@example.com'
        self.user = User.objects.create_user(username=self.username, password=self.password, email=self.email)

    def test_register_view(self):
        response = self.client.post(reverse('register'), {
            'username': 'newuser',
            'password': 'newpassword',
            'email': 'newuser@example.com'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('message'), 'User registered successfully')

    def test_register_view_existing_user(self):
        response = self.client.post(reverse('register'), {
            'username': self.username,
            'password': self.password,
            'email': self.email
        }, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json().get('error'), 'Username already exists')

    def test_login_view(self):
        response = self.client.post(reverse('login'), {
            'username': self.username,
            'password': self.password
        }, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('message'), 'Login successful')

    def test_login_view_invalid_credentials(self):
        response = self.client.post(reverse('login'), {
            'username': self.username,
            'password': 'wrongpassword'
        }, content_type='application/json')
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json().get('error'), 'Invalid credentials')

    def test_logout_view(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.get(reverse('logout'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('message'), 'Logged out successfully')

    def test_check_auth_view_authenticated(self):
        self.client.login(username=self.username, password=self.password)
        response = self.client.get(reverse('check-auth'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('isAuthenticated'), True)

    def test_check_auth_view_unauthenticated(self):
        response = self.client.get(reverse('check-auth'))
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json().get('isAuthenticated'), False)
