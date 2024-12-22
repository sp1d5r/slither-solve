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
exports.retrieveCheckoutSession = exports.retrieveSubscription = exports.updateSubscription = exports.cancelSubscription = exports.getCustomerSubscriptions = exports.createCheckoutSession = exports.createCustomer = exports.handleWebhook = void 0;
const PaymentsService_1 = require("../services/payments/PaymentsService");
const shared_1 = require("shared");
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.headers['stripe-signature'];
        const event = PaymentsService_1.PaymentService.handleWebhookReceived(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
        // Handle different event types
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                // Get customer ID and metadata from the session
                const { customer, metadata } = session;
                const userId = metadata === null || metadata === void 0 ? void 0 : metadata.userId; // Make sure to pass this in createCheckoutSession
                if (userId) {
                    // Update user profile in Firebase
                    yield updateUserSubscription(userId, {
                        stripeCustomerId: customer,
                        selectedPlan: metadata.planType, // Add this to session metadata
                        subscriptionStatus: 'active',
                        subscriptionId: session.subscription,
                        currentPeriodEnd: new Date((Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000).toISOString(),
                    });
                }
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const userId = subscription.metadata.userId; // Make sure to pass this when creating subscription
                if (userId) {
                    yield updateUserSubscription(userId, {
                        subscriptionStatus: subscription.status,
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
                    });
                }
                break;
            }
        }
        res.json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: 'Webhook error' });
    }
});
exports.handleWebhook = handleWebhook;
const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { email, name, metadata } = req.body;
        yield PaymentsService_1.PaymentService.createCustomer({
            email,
            name,
            metadata: Object.assign(Object.assign({}, metadata), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid }),
        }, (customerId) => {
            res.json({ customerId });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createCustomer = createCustomer;
// Helper function to update user subscription in Firebase
function updateUserSubscription(userId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            shared_1.FirebaseDatabaseService.updateDocument('users', userId, data, () => resolve(), (error) => reject(error));
        });
    });
}
// Update createCheckoutSession to include metadata
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { priceId, customerId, successUrl, cancelUrl, userId, planType } = req.body;
        yield PaymentsService_1.PaymentService.createCheckoutSession(priceId, customerId, successUrl, cancelUrl, {
            userId,
            planType,
        }, // Add metadata
        (sessionUrl) => {
            res.json({ url: sessionUrl });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
const getCustomerSubscriptions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customerId } = req.params;
        yield PaymentsService_1.PaymentService.getCustomerSubscriptions(customerId, (subscriptions) => {
            res.json({ subscriptions });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getCustomerSubscriptions = getCustomerSubscriptions;
const cancelSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionId } = req.params;
        yield PaymentsService_1.PaymentService.cancelSubscription(subscriptionId, (subscription) => {
            res.json({ subscription });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.cancelSubscription = cancelSubscription;
const updateSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionId } = req.params;
        const updateData = req.body;
        yield PaymentsService_1.PaymentService.updateSubscription(subscriptionId, updateData, (subscription) => {
            res.json({ subscription });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateSubscription = updateSubscription;
const retrieveSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionId } = req.params;
        yield PaymentsService_1.PaymentService.retrieveSubscription(subscriptionId, (subscription) => {
            res.json({ subscription });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.retrieveSubscription = retrieveSubscription;
const retrieveCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        yield PaymentsService_1.PaymentService.retrieveCheckoutSession(sessionId, (session) => {
            res.json({ session });
        }, (error) => {
            res.status(400).json({ error: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.retrieveCheckoutSession = retrieveCheckoutSession;
