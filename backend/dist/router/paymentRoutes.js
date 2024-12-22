"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes (no auth required)
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleWebhook);
// Protected routes (require authentication)
router.post('/create-checkout-session', auth_1.authenticateToken, paymentController_1.createCheckoutSession);
router.post('/create-customer', auth_1.authenticateToken, paymentController_1.createCustomer);
router.get('/subscriptions/:customerId', auth_1.authenticateToken, paymentController_1.getCustomerSubscriptions);
router.post('/subscriptions/:subscriptionId/cancel', auth_1.authenticateToken, paymentController_1.cancelSubscription);
router.put('/subscriptions/:subscriptionId', auth_1.authenticateToken, paymentController_1.updateSubscription);
router.get('/subscriptions/:subscriptionId', auth_1.authenticateToken, paymentController_1.retrieveSubscription);
router.get('/checkout-sessions/:sessionId', auth_1.authenticateToken, paymentController_1.retrieveCheckoutSession);
exports.default = router;
