# Run Django Tests with Coverage Metrics

This feature automates the testing and coverage reporting of a Django application during pull requests. It runs tests using `pytest` and generates a coverage report, which is posted as a comment on the pull request.

---

## What Is It?
The **Run Django Tests with Coverage** feature ensures that every pull request to the `main` or `develop` branches triggers the execution of Django tests along with coverage analysis. The coverage results are provided as an XML report, which is then used to post a coverage summary as a comment on the pull request.  
This feature is essential for maintaining code quality and ensuring that tests cover the necessary parts of the application.

---

## How it works?
1. The feature is triggered by a pull request to the `main` or `develop` branches.
2. It sets up a CI pipeline on an Ubuntu runner that:
   - Checks out the repository code.
   - Sets up Python 3.9.
   - Installs the required dependencies for testing (`pytest`, `pytest-cov`, `django`, etc.).
   - Configures the Django settings.
3. The pipeline runs tests with coverage using `pytest` and generates a coverage report in XML format.
4. The generated XML file is used to post a coverage summary as a comment on the pull request via the `pytest-coverage-comment` action.

---

## How to Use It
1. Ensure the GitHub Actions workflow YAML is added to your repository in `.github/workflows/`.
2. When a pull request is opened to the `main` or `develop` branch, the workflow will automatically trigger.
3. Review the test and coverage results posted as a comment on the pull request once the job completes.

Example:
```yaml
# Example GitHub Actions workflow file for running Django tests with coverage
name: Run Django Tests with Coverage

on:
  pull_request:
    branches:
      - main
      - develop
