import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook for real-time category updates via Supabase Realtime
 * Automatically invalidates React Query cache when categories change
 */
export function useRealtimeCategories() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const supabase = createClient()

    // Subscribe to categories table changes
    const channel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'categories',
        },
        (payload) => {
          console.log('Category change received:', payload)

          // Invalidate categories queries to refetch data
          queryClient.invalidateQueries({ queryKey: ['categories'] })
          queryClient.invalidateQueries({ queryKey: ['categories-with-count'] })
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
