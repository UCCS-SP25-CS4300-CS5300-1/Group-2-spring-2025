import unittest
from unittest.mock import patch, MagicMock
import review


class Test_AI_Review(unittest.TestCase):

    @patch('review.OpenAI')
    @patch('review.Github')
    @patch('review.os.getenv')
    def test_initialize(self, mock_getenv, mock_github, mock_openai):
        # Test successful initialization
        mock_getenv.side_effect = lambda key: {
            'OPENAI_API_KEY': 'fake_openai_key',
            'GITHUB_TOKEN': 'fake_github_token',
            'GITHUB_REPOSITORY': 'fake_repo',
            'GITHUB_PR_ID': '1'
        }.get(key)

        client, g, repo_name, pr_id = review.initialize()

        self.assertIsNotNone(client)
        self.assertIsNotNone(g)
        self.assertEqual(repo_name, 'fake_repo')
        self.assertEqual(pr_id, '1')

        # Test missing environment variables
        mock_getenv.side_effect = lambda key: None
        with self.assertRaises(ValueError):
            review.initialize()

    @patch('review.Github')
    def test_get_repo_and_pull_request(self, mock_github):
        # Test successful fetch
        mock_repo = MagicMock()
        mock_pr = MagicMock()
        mock_github.return_value.get_repo.return_value = mock_repo
        mock_repo.get_pull.return_value = mock_pr

        g = mock_github('fake_github_token')
        repo, pr = review.get_repo_and_pull_request(g, 'fake_repo', '1')

        self.assertEqual(repo, mock_repo)
        self.assertEqual(pr, mock_pr)

        # Test fetch failure
        mock_github.return_value.get_repo.side_effect = Exception("Failed to fetch")
        with self.assertRaises(ValueError):
            review.get_repo_and_pull_request(g, 'fake_repo', '1')

    def test_fetch_files_from_pr(self):
        # Test successful fetch
        mock_pr = MagicMock()
        mock_file = MagicMock()
        mock_file.filename = 'test_file.py'
        mock_file.patch = 'fake_patch'
        mock_pr.get_files.return_value = [mock_file]

        diff = review.fetch_files_from_pr(mock_pr)

        expected_diff = "File: test_file.py\nChanges:\nfake_patch\n\n"
        self.assertEqual(diff, expected_diff)

        # Test fetch failure
        mock_pr.get_files.side_effect = Exception("Failed to fetch files")
        with self.assertRaises(ValueError):
            review.fetch_files_from_pr(mock_pr)

    @patch('review.OpenAI')
    def test_request_code_review(self, mock_openai):
        # Test successful request
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.choices[0].message.content = 'fake_review'
        mock_client.chat.completions.create.return_value = mock_response

        diff = 'fake_diff'
        review_comments = review.request_code_review(diff, mock_client)

        self.assertEqual(review_comments, 'fake_review')

        # Test request failure
        mock_client.chat.completions.create.side_effect = Exception("Failed to get review")
        with self.assertRaises(ValueError):
            review.request_code_review(diff, mock_client)

    def test_post_review_comments(self):
        # Test successful post
        mock_pr = MagicMock()
        review_comments = 'fake_review'

        review.post_review_comments(mock_pr, review_comments)

        mock_pr.create_issue_comment.assert_called_once_with(review_comments)

        # Test post failure
        mock_pr.create_issue_comment.side_effect = Exception("Failed to post comment")
        with self.assertRaises(ValueError):
            review.post_review_comments(mock_pr, review_comments)

    @patch('review.initialize')
    @patch('review.get_repo_and_pull_request')
    @patch('review.fetch_files_from_pr')
    @patch('review.request_code_review')
    @patch('review.post_review_comments')
    def test_main_success(self, mock_post_review_comments, mock_request_code_review, mock_fetch_files_from_pr,
                          mock_get_repo_and_pull_request, mock_initialize):
        # Test successful main execution
        mock_initialize.return_value = (MagicMock(), MagicMock(), 'fake_repo', '1')
        mock_get_repo_and_pull_request.return_value = (MagicMock(), MagicMock())
        mock_fetch_files_from_pr.return_value = 'fake_diff'
        mock_request_code_review.return_value = 'fake_review'

        review.main()

        mock_initialize.assert_called_once()
        mock_get_repo_and_pull_request.assert_called_once()
        mock_fetch_files_from_pr.assert_called_once()
        mock_request_code_review.assert_called_once()
        mock_post_review_comments.assert_called_once()
