import { useEffect, useState } from 'react';
import type { Book, BookResponse } from '../types/Book';

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      `http://localhost:5175/api/books?page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}`
    )
      .then((res) => res.json())
      .then((data: BookResponse) => {
        setBooks(data.books);
        setTotalPages(data.totalPages);
        setTotalCount(data.totalCount);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize, sortOrder]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Online Bookstore</h1>

      {/* Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="pageSizeSelect" className="form-label mb-0 fw-semibold">
            Results per page:
          </label>
          <select
            id="pageSizeSelect"
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <span className="text-muted">
          Showing {books.length} of {totalCount} books
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>
                  <button
                    className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                    onClick={toggleSort}
                  >
                    Title
                    <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                  </button>
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Pages</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.bookId}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.category || book.classification}</td>
                  <td>{book.numPages}</td>
                  <td>${book.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(1)}>
              «
            </button>
          </li>
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage((p) => p - 1)}>
              ‹
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | string)[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                acc.push('...');
              }
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              p === '...' ? (
                <li key={`ellipsis-${idx}`} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={p} className={`page-item ${page === p ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(p as number)}>
                    {p}
                  </button>
                </li>
              )
            )}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage((p) => p + 1)}>
              ›
            </button>
          </li>
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setPage(totalPages)}>
              »
            </button>
          </li>
        </ul>
      </nav>
      <p className="text-center text-muted">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}

export default BookList;
