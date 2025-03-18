import os
import subprocess
from github import Github

def initialize():
    """Initialize GitHub connection and fetch required environment variables."""
    try:
        # Get GitHub token and repository info from environment variables
        github_token = os.getenv('GITHUB_TOKEN')
        if not github_token:
            raise ValueError("GITHUB_TOKEN is not set")

        repo_name = os.getenv('GITHUB_REPOSITORY')
        if not repo_name:
            raise ValueError("GITHUB_REPOSITORY is not set")

        pr_id = os.getenv('GITHUB_PR_ID')
        if not pr_id:
            raise ValueError("GITHUB_PR_ID is not set")

        # Initialize Github instance
        g = Github(github_token)

        return g, repo_name, pr_id
    except Exception as e:
        raise ValueError(f"Failed to initialize: {e}")

def get_repo_and_pull_request(g, repo_name, pr_id):
    """Fetch the repository and PR from GitHub."""
    try:
        repo = g.get_repo(repo_name)
        pr = repo.get_pull(int(pr_id))
        return repo, pr
    except Exception as e:
        raise ValueError(f"Failed to fetch repo or pull request: {e}")

def run_pytest():
    """Run pytest and capture the output."""
    try:
        result = subprocess.run(["pytest", "--tb=short"], capture_output=True, text=True)
        return result.stdout
    except Exception as e:
        raise ValueError(f"Failed to run pytest: {e}")

def post_test_results(pr, test_results):
    """Post pytest results as a PR comment."""
    try:
        comment = f"### 🧪 Test Results\n```\n{test_results}\n```"
        pr.create_issue_comment(comment)
        print("Test results posted successfully.")
    except Exception as e:
        raise ValueError(f"Failed to post test results: {e}")

def main():
    try:
        # Initialize GitHub connection
        g, repo_name, pr_id = initialize()

        # Fetch repo and PR
        repo, pr = get_repo_and_pull_request(g, repo_name, pr_id)

        # Run pytest
        test_results = run_pytest()

        # Post test results as PR comment
        post_test_results(pr, test_results)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
