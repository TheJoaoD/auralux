# Real-time Architecture

## Supabase Realtime Setup

### Database Triggers for Broadcasts

```sql
-- Function to broadcast new catalog request
CREATE OR REPLACE FUNCTION notify_catalog_request()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
BEGIN
  -- Get user name
  SELECT name INTO user_name
  FROM catalog_users
  WHERE whatsapp = NEW.user_whatsapp;

  -- Broadcast to 'catalog_requests' channel
  PERFORM pg_notify(
    'catalog_requests',
    json_build_object(
      'id', NEW.id,
      'user_whatsapp', NEW.user_whatsapp,
      'user_name', user_name,
      'product_name', NEW.product_name,
      'observations', NEW.observations,
      'created_at', NEW.created_at
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_catalog_request_insert
  AFTER INSERT ON catalog_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_catalog_request();

-- Function to broadcast new order
CREATE OR REPLACE FUNCTION notify_catalog_order()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  items_count INTEGER;
BEGIN
  -- Get user name
  SELECT name INTO user_name
  FROM catalog_users
  WHERE whatsapp = NEW.user_whatsapp;

  -- Count items
  SELECT jsonb_array_length(NEW.items) INTO items_count;

  -- Broadcast to 'catalog_orders' channel
  PERFORM pg_notify(
    'catalog_orders',
    json_build_object(
      'id', NEW.id,
      'user_whatsapp', NEW.user_whatsapp,
      'user_name', user_name,
      'total', NEW.total,
      'items_count', items_count,
      'created_at', NEW.created_at
    )::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_catalog_order_insert
  AFTER INSERT ON catalog_orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_catalog_order();
```

### Client-side Realtime Subscriptions

```typescript
// lib/services/catalog-realtime.ts
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export interface CatalogRequestNotification {
  id: string
  user_whatsapp: string
  user_name: string
  product_name: string
  observations: string | null
  created_at: string
}

export interface CatalogOrderNotification {
  id: string
  user_whatsapp: string
  user_name: string
  total: number
  items_count: number
  created_at: string
}

export function useCatalogRequestsSubscription() {
  const [notifications, setNotifications] = useState<CatalogRequestNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('catalog_requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'catalog_requests'
      }, (payload) => {
        const notification = payload.new as CatalogRequestNotification
        setNotifications(prev => [notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return notifications
}

export function useCatalogOrdersSubscription() {
  const [notifications, setNotifications] = useState<CatalogOrderNotification[]>([])
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('catalog_orders')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'catalog_orders'
      }, (payload) => {
        const notification = payload.new as CatalogOrderNotification
        setNotifications(prev => [notification, ...prev])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return notifications
}
```

---
