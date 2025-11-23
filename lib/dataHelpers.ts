import path from 'path';
import { promises as fs } from 'fs';

// Define paths to your data files
const booksFilePath = path.join(process.cwd(), 'app/data/books.json');
const reviewsFilePath = path.join(process.cwd(), 'app/data/reviews.json');

// Interfaces for your data
export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  price: number;
  image?: string;
  isbn?: string;
  genre?: string[];
  tags?: string[];
  datePublished: string;
  pages?: number;
  language?: string;
  publisher?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
}

export interface Review {
  id: string;
  bookId: string;
  author: string; // reviewer name
  rating: number;
  title?: string;
  comment: string;
  timestamp: string;
  verified?: boolean;
}

// Helper to read books
export async function getBooks(): Promise<Book[]> {
  const fileContents = await fs.readFile(booksFilePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.books;
}

// Helper to write books (Works locally, ephemeral on Vercel)
export async function saveBooks(books: Book[]): Promise<void> {
  await fs.writeFile(booksFilePath, JSON.stringify({ books }, null, 2), 'utf8');
}

// Helper to read reviews
export async function getReviews(): Promise<Review[]> {
  const fileContents = await fs.readFile(reviewsFilePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.reviews;
}

// Helper to write reviews (Works locally, ephemeral on Vercel)
export async function saveReviews(reviews: Review[]): Promise<void> {
  await fs.writeFile(reviewsFilePath, JSON.stringify({ reviews }, null, 2), 'utf8');
}