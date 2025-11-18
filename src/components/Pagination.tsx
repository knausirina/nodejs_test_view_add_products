"use client";

import { PAGINATION_BUTTONS_COUNT } from "../configs/Config";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const maxButtons = Math.max(1, PAGINATION_BUTTONS_COUNT);

  const half = Math.floor(maxButtons / 2);
  let start = currentPage - half;
  let end = start + maxButtons - 1;

  if (start < 1) {
    start = 1;
    end = Math.min(maxButtons, totalPages);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxButtons + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const enableNextPage = !(currentPage === totalPages || isLoading);
  const enablePrevPage = !(currentPage === 1 || isLoading);
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={!enablePrevPage}
        aria-disabled={!enablePrevPage}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        &lt;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={isLoading}
          aria-disabled={isLoading}
          className={`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : "border hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={!enableNextPage}
        aria-disabled={!enableNextPage}
        className="px-3 py-1 rounded border disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
}
