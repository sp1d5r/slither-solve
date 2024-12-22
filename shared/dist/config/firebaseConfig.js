"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase/app");
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.default = app;
