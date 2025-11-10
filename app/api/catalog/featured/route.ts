/**
 * API Route: Toggle product featured status in catalog
 * POST /api/catalog/featured
 * Body: { productId: string, featured: boolean }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, featured } = body

    if (!productId || typeof featured !== 'boolean') {
      return NextResponse.json(
        { error: 'Product ID and featured status are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if product is in catalog
    const { data: catalogItem, error: checkError } = await supabase
      .from('catalog_items')
      .select('id, visible')
      .eq('product_id', productId)
      .single()

    if (checkError || !catalogItem) {
      return NextResponse.json(
        { error: 'Product must be in catalog first' },
        { status: 400 }
      )
    }

    if (!catalogItem.visible) {
      return NextResponse.json(
        { error: 'Product must be visible in catalog' },
        { status: 400 }
      )
    }

    // If setting as featured, get current featured count
    if (featured) {
      const { count } = await supabase
        .from('catalog_items')
        .select('*', { count: 'exact', head: true })
        .eq('featured', true)

      // Auto-assign featured_order
      const { error } = await supabase
        .from('catalog_items')
        .update({
          featured: true,
          featured_order: (count || 0) + 1,
        })
        .eq('product_id', productId)

      if (error) throw error
    } else {
      // Remove featured status
      const { error } = await supabase
        .from('catalog_items')
        .update({
          featured: false,
          featured_order: null,
        })
        .eq('product_id', productId)

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      featured,
    })
  } catch (error) {
    console.error('Error toggling featured:', error)
    return NextResponse.json(
      { error: 'Failed to update featured status' },
      { status: 500 }
    )
  }
}
