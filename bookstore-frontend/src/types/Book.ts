export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  numPages: number;
  price: number;
}

export interface BookResponse {
  books: Book[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
