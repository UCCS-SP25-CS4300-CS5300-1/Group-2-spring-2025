# Environment Variable Configuration in React App

## Feature Name
Environment Variable Configuration for API URLs in React Application

---

## What Is It?
This feature allows the React application to dynamically load environment-specific API URLs using environment variables. It enables the use of different API endpoints based on the environment (development, production) in which the application is running. This feature is essential for ensuring that the app interacts with the correct backend API in different environments, such as local development or production deployments.

---

## How it works?
The React application uses environment variables to store API URLs. These variables are defined in `.env` files and are accessed using `process.env`. Based on the environment (e.g., development or production), different values can be loaded:

- **Development**: In `.env.development`, the local API URL (e.g., `http://127.0.0.1:8000/api`) is set.
- **Production**: In `.env.production`, the production API URL (e.g., `https://your-production-api-url.com/api`) is set.

Vite automatically picks up these variables based on the environment and substitutes them into the application code during the build process.

---

## How to Use It
To use this feature, you need to define the environment variables and ensure the React app is properly set up to use them.

1. **Set Up Environment Variables**
    - Create `.env`, `.env.development`, and `.env.production` files in the root of your project.
    - Define the `VITE_DJANGO_BASE_URL` variable in each file with the appropriate API URL for the environment.

   Example:
    - `.env.development`:
      ```env
      VITE_DJANGO_BASE_URL=http://127.0.0.0:8000/api
      ```
