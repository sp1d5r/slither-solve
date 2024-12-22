export default interface UserProfile {
    displayName: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    industry?: string;
    referralSource?: string;
    companyName?: string;
    companySize?: string;
    selectedPlan?: 'free' | 'pro' | 'enterprise';
    stripeCustomerId?: string;
    subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing' | 'none';
    subscriptionId?: string;
    currentPeriodEnd?: string;
}
