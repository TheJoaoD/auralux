/**
 * API Route: Toggle product visibility in catalog
 * POST /api/catalog/toggle
 * Body: { productId: string, visible: boolean }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, visible } = body

    if (!productId || typeof visible !== 'boolean') {
      return NextResponse.json(
        { error: 'Product ID and visible status are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if catalog item exists
    const { data: existing } = await supabase
      .from('catalog_items')
      .select('id')
      .eq('product_id', productId)
      .single()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('catalog_items')
        .update({ visible })
        .eq('product_id', productId)

      if (error) throw error
    } else {
      // Insert new
      const { error } = await supabase
        .from('catalog_items')
        .insert({
          product_id: productId,
          visible,
          featured: false,
        })

      if (error) throw error
    }

    return NextResponse.json({
      success: true,
      visible,
    })
  } catch (error) {
    console.error('Error toggling catalog:', error)
    return NextResponse.json(
      { error: 'Failed to update catalog' },
      { status: 500 }
    )
  }
}
