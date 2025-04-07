# Project Overview

This project consists of two main environments: **Onboarding** and the **Main Application**. Each environment has its specific setup and deployment processes.

## 1. Onboarding Environment

### Description
The Onboarding environment is managed using Azure AD B2C. This module handles the user onboarding process for the application.

### Setup Instructions
1. **Checkout Code**: Switch to the `onboarding` branch to find the code related to the onboarding modules.
   ```bash
   git checkout onboarding
   ```

2. **Build for Development**: Run the following command to build the onboarding environment for development:
   ```bash
   npm run devbuild
   ```

## 2. Main Application Environment

### Description
The Main Application is the core environment where the primary functionalities of the project reside.

### Setup Instructions
1. **Checkout Code**:
   - For Development:
     ```bash
     git checkout branch-name
     ```
     ***Note: **`branch-name` is the branch given by the team in which all the latest code will be.*
     

2. **Setup Environment Variables**:

      - Create folders named `.env`, `.env.stage`, `.env.prod` in the root directory.
      - Obtain the environment variables from the team and place them inside the respected folder.


3. **Node version: ** 
      ```bash
      ^v18.20.4
      ```

4. **Install Dependencies**:
   ```bash
   npm install
   ```
   or
   ```bash
   npm i
   ```

## Available Scripts

Within the project directory, you have access to several npm scripts for various tasks:

### **Scripts to run the Application**:
- **Purpose**: Runs the app in development mode.
- **Usage**: Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
- **Note**: The page will automatically reload when you make changes to the source code.

   1. *For development server:*
         ```bash
         npm start
         ```
         or
         ```bash
         npm run start:dev
         ```

   2. *For staging server:*
         ```bash
         npm run start:stage
         ```

   3. *For production server:*
         ```bash
         npm run start:prod
         ```

### **Scripts to run the Application build**:
- **Purpose**: Builds the app for production.
- **Output**: The build artifacts are stored in the `build` folder.
- **Details**: This script correctly bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include hashes for efficient caching.
- **Deployment**: Once built, your app is ready to be deployed.

   1. *For development server:*
         ```bash
         npm run build
         ```
         or
         ```bash
         npm run build:dev
         ```

   2. *For staging server:*
         ```bash
         npm run build:stage
         ```

   3. *For production server:*
         ```bash
         npm run build:prod
         ```