"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const firebase_admin_1 = require("../config/firebase-admin");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = yield firebase_admin_1.auth.verifyIdToken(token);
            req.user = {
                uid: decodedToken.uid,
                email: decodedToken.email || '',
                name: decodedToken.name || '',
            };
            next();
        }
        catch (error) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
    }
    catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
});
exports.authenticateToken = authenticateToken;
