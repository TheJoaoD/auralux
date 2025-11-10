/**
 * Debounced Value Hook
 * Epic 2 - Story 2.3: Listagem de Produtos com Filtros
 *
 * Delays updating a value until after a specified delay
 * Useful for search inputs to avoid excessive API calls
 */

'use client'

import { useState, useEffect } from 'react'

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
