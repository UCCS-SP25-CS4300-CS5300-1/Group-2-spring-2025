# Feature Documentation Template

## Pull Request Code Review Automation

This feature automates the process of reviewing pull requests on GitHub by integrating OpenAI's GPT-4 to provide code reviews.

---

## What Is It?
The **Pull Request Code Review Automation** feature retrieves a pull request from a GitHub repository, sends the changes to OpenAI's GPT-4 model for review, and automatically posts the review as a comment on the pull request.  
This feature is useful for automating the code review process, ensuring consistent feedback and reducing the manual workload of reviewers.

---

## How it works?
1. The script fetches the pull request and associated files from GitHub using the GitHub API.
2. It sends the file diffs to OpenAI's GPT-4 model for analysis and review.
3. The model generates a review that includes a score and suggestions for improvements.
4. The script posts the generated review comments back to the pull request as a GitHub comment.

---

## How to Use It
1. Create a new pull request in our GitHub repository.
2. Profit
