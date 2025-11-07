/**
 * WhatsApp formatting utilities
 * Handles Brazilian WhatsApp number formats
 */

/**
 * Formats a WhatsApp number to Brazilian format: (XX) XXXXX-XXXX
 * @param value - Raw WhatsApp number (can include non-digits)
 * @returns Formatted WhatsApp number
 */
export function formatWhatsApp(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Format based on length
  if (digits.length === 11) {
    // (XX) XXXXX-XXXX format
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (digits.length === 10) {
    // (XX) XXXX-XXXX format (landline)
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }

  // Return original if not 10 or 11 digits
  return value
}

/**
 * Removes all non-digit characters from WhatsApp number
 * @param value - WhatsApp number (can include formatting)
 * @returns Only digits
 */
export function normalizeWhatsApp(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Validates if a WhatsApp number has correct Brazilian format
 * @param value - WhatsApp number to validate
 * @returns true if valid, false otherwise
 */
export function isValidWhatsApp(value: string): boolean {
  const digits = normalizeWhatsApp(value)

  // Must have 10 or 11 digits
  if (digits.length !== 10 && digits.length !== 11) {
    return false
  }

  // If 11 digits, must start with 9 (mobile)
  if (digits.length === 11 && digits[2] !== '9') {
    return false
  }

  return true
}

/**
 * Formats currency to Brazilian Real (BRL)
 * @param value - Numeric value
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formats a date to Brazilian format
 * @param date - Date object or string
 * @returns Formatted date string (DD/MM/YYYY)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR').format(dateObj)
}

/**
 * Formats a date with time to Brazilian format
 * @param date - Date object or string
 * @returns Formatted datetime string (DD/MM/YYYY HH:MM)
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dateObj)
}

/**
 * Date range interface
 */
export interface DateRange {
  startDate: Date
  endDate: Date
}

/**
 * Gets date range based on period
 * @param period - Period type
 * @returns DateRange object with start and end dates
 */
export function getDateRange(period: 'today' | 'week' | 'month' | '30days'): DateRange {
  const now = new Date()
  const startDate = new Date()

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(now.getDate() - 7)
      break
    case '30days':
      startDate.setDate(now.getDate() - 30)
      break
    case 'month':
      startDate.setDate(1)
      startDate.setHours(0, 0, 0, 0)
      break
  }

  return { startDate, endDate: now }
}
