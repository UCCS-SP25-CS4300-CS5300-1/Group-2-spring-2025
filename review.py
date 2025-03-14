import os
import openai
from github import Github
from openai import OpenAI


# Get repository and pull request
def get_repo_and_pull_request(g, repo_name, pr_id):
    try:
        repo = g.get_repo(repo_name)
        pr = repo.get_pull(int(pr_id))
        return repo, pr
    except Exception as e:
        raise ValueError(f"Failed to fetch repo or pull request: {e}")


# Fetch changed files from pull request
def fetch_files_from_pr(pr):
    try:
        files = pr.get_files()
        diff = ""
        for file in files:
            diff += f"File: {file.filename}\nChanges:\n{file.patch}\n\n"
        return diff
    except Exception as e:
        raise ValueError(f"Failed to fetch files from PR: {e}")


# Request code review from OpenAI
def request_code_review(diff, client):
    try:
        # Request a code review using the new API structure
        response = client.chat.completions.create(
            model="gpt-4o",  # Correct model name, change it if needed
            messages=[
                {"role": "system", "content": "You are a helpful code reviewer."},
                {"role": "user",
                 "content": f"Please review the following code for potential issues or improvements: \nstart with giving"
                            f" it a score out of 10, then if youre going to suggest changes please reference the code"
                            f" directly \n please list no more than 5 items but only if it is necessary:\n{diff}"}


            ],
            max_tokens=2048,
            temperature=0.5
        )

        # Extract the review comments from the response
        return response.choices[0].message.content

    except Exception as e:
        raise ValueError(f"Failed to get code review from OpenAI: {e}")


# Post the review comments to GitHub PR
def post_review_comments(pr, review_comments):
    try:
        pr.create_issue_comment(review_comments)
    except Exception as e:
        raise ValueError(f"Failed to post review comments: {e}")


# Main execution flow
def main():
    try:

        client = OpenAI()
        github_token = os.getenv('GITHUB_TOKEN')
        g = Github(github_token)

        # Get necessary environment variables
        repo_name = os.getenv('GITHUB_REPOSITORY')  # Example: 'UCCS-SP25-CS4300-CS5300-1/Group-2-spring-2025'
        pr_id = os.getenv('GITHUB_PR_ID')


        # Get repository and pull request
        repo, pr = get_repo_and_pull_request(g, repo_name, pr_id)

        # Fetch files changed in the PR
        diff = fetch_files_from_pr(pr)

        # Request code review from OpenAI
        review_comments = request_code_review(diff, client)

        # Post the review comments as a GitHub PR comment
        post_review_comments(pr, review_comments)

        print("Code review posted successfully.")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
