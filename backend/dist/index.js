"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const firebaseConfig_1 = require("shared/src/config/firebaseConfig");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
(0, firebaseConfig_1.initializeFirebase)({
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
});
const dotenv_1 = require("dotenv");
const serverless_http_1 = __importDefault(require("serverless-http"));
const articleRoutes_1 = __importDefault(require("./router/articleRoutes"));
const paymentRoutes_1 = __importDefault(require("./router/paymentRoutes"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
console.log(process.env.FRONTEND_URL);
// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
};
// Apply CORS to all routes EXCEPT the webhook
app.use((req, res, next) => {
    if (req.path === '/api/payments/webhook') {
        // Skip CORS for webhooks as Stripe needs raw body
        next();
    }
    else {
        (0, cors_1.default)(corsOptions)(req, res, next);
    }
});
// Parse JSON bodies for all routes EXCEPT webhook
app.use((req, res, next) => {
    if (req.path === '/api/payments/webhook') {
        // Use raw body for webhook
        next();
    }
    else {
        express_1.default.json()(req, res, next);
    }
});
// Routes 
app.use('/api/articles', articleRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
exports.handler = (0, serverless_http_1.default)(app);
