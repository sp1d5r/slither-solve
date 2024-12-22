"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_PLANS = void 0;
exports.PRICING_PLANS = [
    {
        type: 'free',
        name: 'Free',
        price: '$0',
        description: 'Perfect for getting started',
        features: [
            'Basic Features',
            '1 User',
            'Limited Storage',
            'Community Support'
        ]
    },
    {
        type: 'pro',
        name: 'Pro',
        price: '$29/mo',
        description: 'For growing businesses',
        stripePriceId: 'price_1QM7h5GME0Qq6U11b4JKWfFy',
        features: [
            'Advanced Features',
            'Unlimited Users',
            '100GB Storage',
            'Priority Support',
            'Analytics Dashboard',
            'Custom Integrations'
        ]
    },
    {
        type: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations',
        features: [
            'All Pro Features',
            'Dedicated Support',
            'Custom Storage',
            'SLA Agreement',
            'Security Features',
            'API Access'
        ]
    }
];
