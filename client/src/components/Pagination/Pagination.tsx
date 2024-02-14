import { Button } from "@components";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  return (
    <div>
      {totalPages > 1 && (
        <ul className="flex list-none items-center justify-center p-0">
          <li className={`mx-2 my-0  ${currentPage === 1 ? "disabled" : ""}`}>
            <Button
              className="btn btn-primary btn-active btn-sm btn-block text-slate-100"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={`mx-2 my-0 ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`mx-2 my-0 ${currentPage === totalPages ? "disabled" : ""}`}
          >
            <Button
              className="btn btn-primary btn-active btn-sm btn-block text-slate-100"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </li>
        </ul>
      )}
    </div>
  );
};
