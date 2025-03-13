import os
import openai
from github import Github

# Initialize GitHub and OpenAI clients
g = Github(os.getenv('GITHUB_TOKEN'))
repo = g.get_repo('UCCS-SP25-CS4300-CS5300-1/Group-2-spring-2025')  # Replace with your repo details
pr = repo.get_pull(int(os.getenv('GITHUB_PR_ID')))  # Get the pull request

# Fetch the diff or files changed in the pull request
diff = pr.diff()

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
