# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



# Firebase Integration with React

This guide will help you set up Firebase in your React project. Follow the steps below to connect your application to Firebase, set up Firestore and Realtime Database, and configure the necessary security rules.

## Prerequisites

- A Firebase account
- A React project set up in your local development environment

## Steps to Connect Firebase to Your React Project

### Step 1: Log in to Firebase Console
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Log in with your Google account.

![Firebase Console Login](assets/images/firebase-console-login.png)

### Step 2: Create a Firebase Project
1. Click on "Add Project" or select an existing project from the console.
2. Follow the on-screen instructions to create a new Firebase project.

![Create Firebase Project](assets/images/create-firebase-project.png)

### Step 3: Get Firebase Configuration
1. After creating the project, navigate to "Project Settings" by clicking on the gear icon next to "Project Overview".
2. Under the "Your apps" section, click on the `</>` (Web) icon to register your web app.
3. Follow the steps to register your app and obtain your Firebase configuration details.

![Firebase Configuration](assets/images/firebase-config.png)

### Step 4: Create `firebase.js` in Your React Project
1. In your React project's `src` directory, create a file named `firebase.js`.
2. Copy the Firebase configuration details you obtained in the previous step and paste them into `firebase.js` like this:

```javascript
// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;

Step 5: Set Up Firestore Database
In the Firebase Console, go to the "Build" section on the left sidebar.
Click on "Firestore Database".

Click "Create Database".
Choose the default settings and click "Next" until the database is created.
After creation, click on the "Rules" tab.
Change the security rules as follows:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Step 6: Set Up Realtime Database
In the Firebase Console, go to the "Build" section again.
Click on "Realtime Database".

Click "Create Database".
Choose the default settings and click "Next" until the database is created.
After creation, click on the "Rules" tab.
Change the security rules as follows:
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
Step 7: Run Your React Project
In your terminal, navigate to your React project directory.
Start your project by running:
```
npm start
```
Your project should now have access to Firebase services and be able to store data in Firestore and Realtime Database.