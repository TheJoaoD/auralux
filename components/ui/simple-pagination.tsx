'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface SimplePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPreviousPage: boolean
  totalItems?: number
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
  totalItems,
}: SimplePaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-[#A1887F]/20">
      {totalItems !== undefined && (
        <div className="text-sm text-[#A1887F]">
          Total: <span className="font-semibold text-[#E0DCD1]">{totalItems}</span> {totalItems === 1 ? 'item' : 'itens'}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!hasPreviousPage}
          className="p-2 rounded-lg bg-[#A1887F] text-[#E0DCD1] hover:bg-[#8D7A6F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="p-2 rounded-lg bg-[#A1887F] text-[#E0DCD1] hover:bg-[#8D7A6F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-[#E0DCD1]">
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            const isCurrentPage = pageNumber === currentPage

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`
                  min-w-[40px] min-h-[40px] px-3 py-2 rounded-lg font-medium transition-all
                  ${
                    isCurrentPage
                      ? 'bg-[#C49A9A] text-[#202020] shadow-md'
                      : 'bg-[#A1887F] text-[#E0DCD1] hover:bg-[#8D7A6F]'
                  }
                `}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          })}
        </div>

        <div className="sm:hidden px-4 py-2 bg-[#A1887F] rounded-lg text-[#E0DCD1] font-medium">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="p-2 rounded-lg bg-[#A1887F] text-[#E0DCD1] hover:bg-[#8D7A6F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
          className="p-2 rounded-lg bg-[#A1887F] text-[#E0DCD1] hover:bg-[#8D7A6F] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
