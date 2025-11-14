import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Credit plans with Stripe price IDs
 */
const CREDIT_PLANS = {
  starter: {
    name: 'Starter',
    credits: 50,
    price: 2900, // $29.00 in cents
    priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter',
  },
  professional: {
    name: 'Professional',
    credits: 150,
    price: 7900, // $79.00
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || 'price_professional',
  },
  business: {
    name: 'Business',
    credits: 500,
    price: 19900, // $199.00
    priceId: process.env.STRIPE_PRICE_BUSINESS || 'price_business',
  },
  enterprise: {
    name: 'Enterprise',
    credits: 2000,
    price: 59900, // $599.00
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
  },
};

/**
 * POST /api/payment/create-checkout
 * Create Stripe Checkout Session for credit purchase
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const userEmail = decodedToken.email || '';

    // Parse request body
    const body = await request.json();
    const { planId } = body;

    // Validate plan
    if (!planId || !CREDIT_PLANS[planId as keyof typeof CREDIT_PLANS]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const plan = CREDIT_PLANS[planId as keyof typeof CREDIT_PLANS];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.name} Plan - ${plan.credits} Credits`,
              description: `${plan.credits} video generation credits`,
              images: ['https://your-app.com/logo.png'], // Add your logo URL
            },
            unit_amount: plan.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        userId,
        planId,
        credits: plan.credits.toString(),
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
