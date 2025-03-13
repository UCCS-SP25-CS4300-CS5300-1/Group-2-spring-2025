import os
import openai
from github import Github

# Initialize GitHub and OpenAI clients
g = Github(os.getenv('GITHUB_TOKEN'))

# Get the repository name from the environment variable
repo_name = os.getenv('GITHUB_REPOSITORY')  # This will be 'UCCS-SP25-CS4300-CS5300-1/Group-2-spring-2025'

# Get the repository object
repo = g.get_repo(repo_name)

# Get the pull request ID from the environment variable
pr_id = os.getenv('GITHUB_PR_ID')
if pr_id is None:
    raise ValueError("GITHUB_PR_ID environment variable is not set.")

# Get the pull request object
pr = repo.get_pull(int(pr_id))  # Get the pull request

# Fetch the files changed in the pull request
files = pr.get_files()

# Create a string to store the diff of the files
diff = ""
for file in files:
    diff += f"File: {file.filename}\n"
    diff += f"Changes:\n{file.patch}\n\n"

# Call OpenAI's API for code review
openai.api_key = os.getenv('OPENAI_API_KEY')
response = openai.Completion.create(
  model="gpt-3.5-turbo",
  prompt=f"Please review the following code for potential issues or improvements:\n{diff}",
  max_tokens=2048,
  temperature=0.5
)

# Extract the review comments from OpenAI's response
review_comments = response['choices'][0]['text']

# Post the review comments as a GitHub PR comment
pr.create_issue_comment(review_comments)
