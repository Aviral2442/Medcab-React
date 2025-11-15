import clsx from "clsx";
import { Col, Row } from "react-bootstrap";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

export type TablePaginationProps = {
  start: number;
  showInfo?: boolean;
  previousPage: () => void;
  canPreviousPage: boolean;
  pageCount: number;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  nextPage: () => void;
  canNextPage: boolean;
};

const TablePagination = ({
  start,
  showInfo,
  previousPage,
  canPreviousPage,
  pageCount,
  pageIndex,
  setPageIndex,
  nextPage,
  canNextPage,
}: TablePaginationProps) => {
  if (pageCount === 0 || isNaN(pageCount)) return null;

  // Build dynamic pagination items
  const generatePageNumbers = () => {
    const pages: (number | "...")[] = [];

    // Always show first page
    pages.push(0);

    // If only a few pages, show all
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    // Add left ellipsis if needed
    if (pageIndex > 2) {
      pages.push("...");
    }

    // Middle page numbers (current ±1)
    const startPage = Math.max(1, pageIndex - 1);
    const endPage = Math.min(pageCount - 2, pageIndex + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (pageIndex < pageCount - 3) {
      pages.push("...");
    }

    // Always show last page
    pages.push(pageCount - 1);

    return pages;
  };

  const paginationItems = generatePageNumbers();

  return (
    <Row
      className={clsx(
        "align-items-center text-center text-sm-start",
        showInfo ? "justify-content-between" : "justify-content-end"
      )}
    >
      {showInfo && (
        <Col sm>
          <div className="text-muted">
            Showing page <span className="fw-semibold">{start}</span> of{" "}
            <span className="fw-semibold">{pageCount}</span>
          </div>
        </Col>
      )}

      <Col sm="auto" className="mt-3 mt-sm-0">
        <ul className="pagination pagination-boxed mb-0 justify-content-center">
          {/* Prev Button */}
          <li className="page-item">
            <button
              className="page-link"
              onClick={previousPage}
              disabled={!canPreviousPage}
            >
              <TbChevronLeft />
            </button>
          </li>

          {/* Dynamic Pages */}
          {paginationItems.map((item, idx) =>
            item === "..." ? (
              <li key={idx} className="page-item disabled">
                <button className="page-link">…</button>
              </li>
            ) : (
              <li
                key={idx}
                className={`page-item ${pageIndex === item ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageIndex(item as number)}
                >
                  {(item as number) + 1}
                </button>
              </li>
            )
          )}

          {/* Next Button */}
          <li className="page-item">
            <button
              className="page-link"
              onClick={nextPage}
              disabled={!canNextPage}
            >
              <TbChevronRight />
            </button>
          </li>
        </ul>
      </Col>
    </Row>
  );
};

export default TablePagination;
