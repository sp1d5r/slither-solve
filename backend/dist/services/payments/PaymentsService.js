"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const StripePaymentService_1 = require("./strategies/StripePaymentService");
exports.PaymentService = new StripePaymentService_1.StripePaymentService(process.env.STRIPE_API_KEY);
