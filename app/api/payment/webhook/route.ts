import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addCredits } from '@/lib/firestore/init';
import { db } from '@/lib/firebase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * POST /api/payment/webhook
 * Handle Stripe webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        console.log('💰 Payment Intent succeeded:', event.data.object.id);
        break;

      case 'payment_intent.payment_failed':
        console.log('❌ Payment Intent failed:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✅ Checkout completed:', session.id);

    const { userId, planId, credits } = session.metadata || {};

    if (!userId || !credits) {
      console.error('Missing metadata in checkout session:', session.id);
      return;
    }

    const creditsToAdd = parseInt(credits, 10);

    // Add credits to user account
    await addCredits(userId, creditsToAdd, 'purchase');

    // Update user's totalSpent
    const userRef = db.collection('users').doc(userId);
    const currentData = (await userRef.get()).data();
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    await userRef.update({
      totalSpent: (currentData?.totalSpent || 0) + amountPaid,
      plan: planId || 'free',
      updatedAt: new Date(),
    });

    // Create transaction record
    await db.collection('transactions').add({
      userId,
      type: 'credit_purchase',
      amount: creditsToAdd,
      price: amountPaid,
      planId,
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent,
      status: 'completed',
      createdAt: new Date(),
    });

    console.log(`🎉 Added ${creditsToAdd} credits to user ${userId}`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
    throw error;
  }
}
