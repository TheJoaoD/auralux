/**
 * API Route: Check if product is in catalog
 * GET /api/catalog/check?productId={id}
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('catalog_items')
      .select('visible, featured')
      .eq('product_id', productId)
      .single()

    if (error) {
      // Product not in catalog yet
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          inCatalog: false,
          featured: false,
        })
      }
      throw error
    }

    return NextResponse.json({
      inCatalog: data.visible,
      featured: data.featured,
    })
  } catch (error) {
    console.error('Error checking catalog status:', error)
    return NextResponse.json(
      { error: 'Failed to check catalog status' },
      { status: 500 }
    )
  }
}
