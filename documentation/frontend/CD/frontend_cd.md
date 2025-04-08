# Feature Documentation: Frontend Continuous Deployment (CD)

## Feature Name  
**Frontend Continuous Deployment to GitHub Pages**

---

## What Is It?  
This feature enables automatic deployment of the React frontend to GitHub Pages every time code is merged into the `develop` branch.  

It ensures that the latest working version of the frontend is always live and accessible, eliminating the need for manual deployment and reducing the risk of outdated code being shown in production.

---

## How it works?  
The frontend project uses a GitHub Actions workflow (`deploy_frontend.yml`) to automatically build and deploy the React app. Here's what happens:

1. On every `push` to the `develop` branch, GitHub Actions triggers the workflow.
2. The workflow checks out the code, sets up Node.js, installs dependencies, and builds the project with Vite.
3. The built assets in the `dist/` folder are deployed to the `gh-pages` branch using the `gh-pages` npm package.
4. GitHub Pages is configured to serve the site from the `gh-pages` branch.

We use the `GITHUB_TOKEN` for secure, authenticated deployment, and add caching to improve install performance.

---

## How to Use It  

**As a developer:**  
You don't need to do anything special to deploy the frontend — just push or merge your branch into `develop` and the CD pipeline will handle the rest.

### To trigger deployment:

1. Create a feature branch from `develop`
2. Make and commit your changes to the frontend
3. Open a pull request to merge into `develop`
4. Once the PR is approved and merged, GitHub Actions will:
   - Build the React frontend
   - Deploy it automatically to GitHub Pages

### No manual deploy steps needed!

---

#### Example: Workflow trigger on merge to `develop`

```yaml
on:
  push:
    branches:
      - develop
