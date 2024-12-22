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
exports.StripePaymentService = void 0;
const stripe_1 = require("stripe");
class StripePaymentService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.stripe = new stripe_1.Stripe(apiKey, {
            apiVersion: '2024-11-20.acacia',
        });
    }
    createCustomer(data, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield this.stripe.customers.create(data);
                if (onSuccess)
                    onSuccess(customer.id);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    createCheckoutSession(priceId, stripeCustomerId, successUrl, cancelUrl, metadata, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.stripe.checkout.sessions.create({
                    customer: stripeCustomerId,
                    line_items: [{
                            price: priceId,
                            quantity: 1,
                        }],
                    mode: 'subscription',
                    success_url: successUrl,
                    cancel_url: cancelUrl,
                    metadata,
                    subscription_data: {
                        metadata,
                    },
                });
                if (onSuccess)
                    onSuccess(session.url || '');
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    handleWebhookReceived(event, signature, secret) {
        return this.stripe.webhooks.constructEvent(JSON.stringify(event), signature, secret);
    }
    updateSubscription(subscriptionId, data, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield this.stripe.subscriptions.update(subscriptionId, data);
                if (onSuccess)
                    onSuccess(subscription);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    cancelSubscription(subscriptionId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield this.stripe.subscriptions.cancel(subscriptionId);
                if (onSuccess)
                    onSuccess(subscription);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    // Add method to retrieve a subscription
    retrieveSubscription(subscriptionId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield this.stripe.subscriptions.retrieve(subscriptionId);
                if (onSuccess)
                    onSuccess(subscription);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    // Add method to retrieve a checkout session
    retrieveCheckoutSession(sessionId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.stripe.checkout.sessions.retrieve(sessionId);
                if (onSuccess)
                    onSuccess(session);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    createPaymentIntent(amount, currency, stripeCustomerId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntent = yield this.stripe.paymentIntents.create({
                    amount,
                    currency,
                    customer: stripeCustomerId,
                });
                if (onSuccess)
                    onSuccess(paymentIntent.client_secret || '');
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    createSubscription(customerId, planId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscription = yield this.stripe.subscriptions.create({
                    customer: customerId,
                    items: [{ price: planId }],
                });
                if (onSuccess)
                    onSuccess(subscription.id);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    listPaymentsForCustomer(customerId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntents = yield this.stripe.paymentIntents.list({
                    customer: customerId,
                });
                if (onSuccess)
                    onSuccess(paymentIntents.data);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    createSetupIntent(customerId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setupIntent = yield this.stripe.setupIntents.create({
                    customer: customerId,
                });
                if (onSuccess)
                    onSuccess(setupIntent.client_secret || '');
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
    getCustomerSubscriptions(customerId, onSuccess, onFailure) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const subscriptions = yield this.stripe.subscriptions.list({
                    customer: customerId,
                });
                if (onSuccess)
                    onSuccess(subscriptions.data);
            }
            catch (error) {
                if (onFailure)
                    onFailure(error);
            }
        });
    }
}
exports.StripePaymentService = StripePaymentService;
