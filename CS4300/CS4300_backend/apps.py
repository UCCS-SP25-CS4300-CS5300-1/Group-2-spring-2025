"""
needs a docstring for some reason
"""

from django.apps import AppConfig


class Cs4300BackendConfig(AppConfig):
    """
    this too, disabling one thing led to this :(
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'CS4300_backend'
