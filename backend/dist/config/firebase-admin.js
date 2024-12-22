"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
// src/config/firebase-admin.ts
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
// Check if any Firebase apps have been initialized
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)({
        credential: (0, app_1.cert)({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n')
        })
    });
}
exports.auth = (0, auth_1.getAuth)();
