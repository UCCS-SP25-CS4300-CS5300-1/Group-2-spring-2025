import unittest

class AlwaysPassTest(unittest.TestCase):
    def test_always_pass(self):
        self.assertTrue(True)
