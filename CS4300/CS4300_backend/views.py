# File: CS4300/CS4300_backend/views.py

from rest_framework.views import APIView
from rest_framework.response import Response

class ExampleApiView(APIView):
    def get(self, request):
        return Response({'message': 'Hello, world!'})