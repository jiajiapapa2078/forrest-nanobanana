-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  creem_customer_id TEXT,
  creem_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_creem_customer_id ON user_subscriptions(creem_customer_id);
CREATE INDEX idx_user_subscriptions_creem_subscription_id ON user_subscriptions(creem_subscription_id);

-- Enable Row Level Security
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own subscription
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all subscriptions
CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  USING (auth.role() = 'service_role');
