import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Create a Supabase client with service role for admin operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Verify Creem webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get('x-creem-signature');
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    } else if (webhookSecret && !signature) {
      console.error('Webhook signature missing');
      return NextResponse.json(
        { error: 'Signature required' },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    console.log('Received Creem webhook:', event);

    switch (event) {
      case 'checkout.completed':
        await handleCheckoutCompleted(data);
        break;
      
      case 'subscription.created':
        await handleSubscriptionCreated(data);
        break;
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data);
        break;
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(data);
        break;
      
      default:
        console.log('Unhandled webhook event:', event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(data: any) {
  const userId = data.metadata?.userId;
  const planName = data.metadata?.planName;

  if (!userId) {
    console.error('No userId in checkout metadata');
    return;
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('Supabase not configured');
    return;
  }

  // Update user subscription in database
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      plan_name: planName,
      status: 'active',
      creem_customer_id: data.customer,
      creem_subscription_id: data.subscription,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleSubscriptionCreated(data: any) {
  const customerId = data.customer;
  
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('Supabase not configured');
    return;
  }
  
  // Find user by Creem customer ID and update subscription
  const { data: subscription, error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'active',
      creem_subscription_id: data.id,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('creem_customer_id', customerId)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionUpdated(data: any) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('Supabase not configured');
    return;
  }
  
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: data.status,
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('creem_subscription_id', data.id);

  if (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionCancelled(data: any) {
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    console.error('Supabase not configured');
    return;
  }
  
  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('creem_subscription_id', data.id);

  if (error) {
    console.error('Error cancelling subscription:', error);
  }
}

async function handlePaymentSucceeded(data: any) {
  console.log('Payment succeeded:', data.id);
  // Add any additional logic for successful payments
}

async function handlePaymentFailed(data: any) {
  console.log('Payment failed:', data.id);
  // Add any additional logic for failed payments
  // Maybe send an email to the user
}
