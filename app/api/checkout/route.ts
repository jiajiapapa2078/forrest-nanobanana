import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { priceId, planName } = await request.json();

    if (!priceId || !planName) {
      return NextResponse.json(
        { error: 'Price ID and plan name are required' },
        { status: 400 }
      );
    }

    // Get the current user
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Authentication not configured' },
        { status: 500 }
      );
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Please sign in to subscribe' },
        { status: 401 }
      );
    }

    // Create Creem checkout session
    const creemApiKey = process.env.CREEM_API_KEY;
    
    if (!creemApiKey || creemApiKey === 'your-creem-api-key') {
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('Creating Creem checkout session for:', { priceId, planName, userEmail: user.email });

    const checkoutData = {
      product_id: priceId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin')}/pricing`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planName: planName,
        userEmail: user.email,
      },
    };

    const response = await fetch('https://api.creem.io/v1/checkouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': creemApiKey,
      },
      body: JSON.stringify(checkoutData),
    });

    const responseText = await response.text();
    console.log('Creem API response status:', response.status);
    console.log('Creem API response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { error: responseText };
      }
      
      console.error('Creem API error:', errorData);
      
      // Provide more specific error messages
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Payment configuration error. The product may not exist in Creem. Please contact support.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: errorData.error || 'Failed to create checkout session' },
        { status: response.status }
      );
    }

    const checkoutSession = JSON.parse(responseText);

    return NextResponse.json({
      checkoutUrl: checkoutSession.checkout_url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
