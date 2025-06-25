
-- Create order_bump_products table
CREATE TABLE IF NOT EXISTS public.order_bump_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  section_subtitle TEXT,
  product_name TEXT NOT NULL,
  product_image_url TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  promotional_price DECIMAL(10,2),
  cta_link TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT order_bump_products_display_order_check CHECK (display_order >= 1 AND display_order <= 3)
);

-- Add RLS policies
ALTER TABLE public.order_bump_products ENABLE ROW LEVEL SECURITY;

-- Users can only see their own products
CREATE POLICY "Users can view own order bump products" ON public.order_bump_products
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own products (with plan check)
CREATE POLICY "Users can insert own order bump products" ON public.order_bump_products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own products
CREATE POLICY "Users can update own order bump products" ON public.order_bump_products
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own order bump products" ON public.order_bump_products
  FOR DELETE USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_order_bump_products_updated_at
  BEFORE UPDATE ON public.order_bump_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add constraint to limit 3 products per user
CREATE OR REPLACE FUNCTION check_order_bump_limit()
RETURNS TRIGGER AS $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count
  FROM public.order_bump_products
  WHERE user_id = NEW.user_id;

  IF product_count >= 3 THEN
    RAISE EXCEPTION 'Limite máximo de 3 produtos OrderBump atingido';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_order_bump_limit_trigger
  BEFORE INSERT ON public.order_bump_products
  FOR EACH ROW
  EXECUTE FUNCTION check_order_bump_limit();
