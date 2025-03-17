# CI/CD Pipeline for Automated Testing, Code Review, and Deployment

This feature automates our testing, code review, and deployment process using GitHub Actions. It runs automated tests and AI-powered code reviews on every pull request, and automatically deploys the React app to GitHub Pages once changes are merged into the **develop** branch.

---

## What Is It?
The CI/CD pipeline is a set of automated workflows that help ensure code quality and streamline our deployment process. It includes:

- **Automated Testing:**  
  Runs Django tests with coverage checks on every pull request targeting the **develop** branch. This ensures that changes meet our quality standards (coverage ≥ 80%).

- **AI Code Review:**  
  Uses an OpenAI-based code review to provide feedback on the changes made in each PR.

- **Automated Deployment:**  
  Once a PR is manually reviewed and merged into the **develop** branch, the pipeline automatically builds and deploys the React application to GitHub Pages.

---

## How It Works
1. **Pull Request Trigger:**  
   When a developer pushes new commits to a feature branch and opens a PR targeting **develop**, the pipeline triggers two workflows:
   - **Coverage Workflow:** Runs Django tests using pytest and generates a coverage report.
   - **AI Code Review Workflow:** Executes a script (`review.py`) that sends code changes to the OpenAI API for feedback.
  
2. **Manual Review & Merge:**  
   The team reviews the automated test results, code coverage report, and AI code review comments. Once approved, the PR is manually merged into **develop**.

3. **Automated Deployment:**  
   A push event to the **develop** branch triggers the deploy workflow. This workflow builds the React app (using `npm run build`) and deploys it to GitHub Pages (using `npm run deploy`).

---

## How to Use It

**Step 1: Develop and Commit**  
- Work on your feature branch.
- Commit and push your changes to your branch.

**Step 2: Open a Pull Request**  
- Open a PR targeting the **develop** branch.
- The CI workflows will automatically run:
  - The tests and coverage workflow will execute.
  - The AI code review will run and post feedback on the PR.
    
**Step 3: Manual Review & Merge**  
- Review the test results and AI feedback.
- Once approved, manually merge the PR into **develop**.

**Step 4: Automatic Deployment**  
- After merging, the deployment workflow triggers automatically.
- The React app is built and deployed to GitHub Pages.
