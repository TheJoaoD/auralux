/**
 * Product Requests Server Actions
 * Epic 3 - Story 3.4: Product Request System
 */

'use server'

import {
  createProductRequest,
  getUserRequests,
  type CreateRequestData,
} from '@/lib/services/catalog-requests'

export async function createRequest(data: CreateRequestData) {
  return createProductRequest(data)
}

export async function fetchUserRequests() {
  return getUserRequests()
}
