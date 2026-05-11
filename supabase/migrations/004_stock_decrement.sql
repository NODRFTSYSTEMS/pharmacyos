-- Migration 004: Atomic stock decrement function for POS checkout
-- Called by the POS terminal after a sale is recorded to keep stock counts accurate.

CREATE OR REPLACE FUNCTION public.decrement_product_stock(p_product_id uuid, p_qty integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET    stock_qty  = stock_qty - p_qty,
         updated_at = now()
  WHERE  id = p_product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', p_product_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.decrement_product_stock TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock TO anon;
