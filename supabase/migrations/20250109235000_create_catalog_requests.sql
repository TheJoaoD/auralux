-- Create enum type for request status
CREATE TYPE catalog_request_status AS ENUM (
  'pending',
  'analyzing',
  'fulfilled',
  'unavailable'
);

-- Create catalog_requests table
CREATE TABLE catalog_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_whatsapp VARCHAR(20) NOT NULL REFERENCES catalog_users(whatsapp) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  observations TEXT,
  status catalog_request_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_catalog_requests_user ON catalog_requests(user_whatsapp);
CREATE INDEX idx_catalog_requests_status ON catalog_requests(status);
CREATE INDEX idx_catalog_requests_created_at ON catalog_requests(created_at DESC);

-- Enable RLS
ALTER TABLE catalog_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view only their own requests
CREATE POLICY "Users can view own requests"
  ON catalog_requests
  FOR SELECT
  USING (user_whatsapp = (
    SELECT COALESCE(
      (auth.jwt() ->> 'phone')::varchar(20),
      (auth.jwt() ->> 'email')::varchar(20),
      ''
    )
  ));

-- RLS Policy: Users can create their own requests
CREATE POLICY "Users can create own requests"
  ON catalog_requests
  FOR INSERT
  WITH CHECK (user_whatsapp = (
    SELECT COALESCE(
      (auth.jwt() ->> 'phone')::varchar(20),
      (auth.jwt() ->> 'email')::varchar(20),
      ''
    )
  ));

-- RLS Policy: Admins can view all requests
CREATE POLICY "Admins can view all requests"
  ON catalog_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- RLS Policy: Admins can update requests
CREATE POLICY "Admins can update requests"
  ON catalog_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admin', 'manager')
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE catalog_requests IS 'Product requests from catalog users';
