"""
Allows for management of the python backend server. Default django manage.py file.
"""
#!/usr/bin/env python
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault(
        'DJANGO_SETTINGS_MODULE',
        'CS4300_django_server.settings')
    #pylint: disable=import-outside-toplevel
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # If the import fails, ensure that Django is installed and accessible.
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable?"
        ) from exc
    #pylint: enable=import-outside-toplevel

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
