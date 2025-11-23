import { NextResponse, NextRequest } from 'next/server';
import { getBooks, saveBooks, Book } from '@/lib/dataHelpers';
import { isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        let books = await getBooks();

        // 1. Filter by Featured: /api/books?featured=true
        if (featured === 'true') {
            books = books.filter((book) => book.featured === true);
        }

        // 2. Filter by Date Range: /api/books?start=2022-01-01&end=2022-12-31
        if (start && end) {
            const startDate = new Date(start).getTime();
            const endDate = new Date(end).getTime();

            books = books.filter((book) => {
                const pubDate = new Date(book.datePublished).getTime();
                return pubDate >= startDate && pubDate <= endDate;
            });
        }

        return NextResponse.json({ success: true, count: books.length, data: books });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch books' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // Authentication Check
    if (!isAuthenticated(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Missing or invalid x-api-key' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const books = await getBooks();

        // Generate a simple ID (not robust for concurrent writes)
        const newBook: Book = {
            id: (books.length + 1).toString(),
            reviewCount: 0,
            rating: 0,
            featured: false,
            inStock: true,
            datePublished: new Date().toISOString().split('T')[0],
            ...body, // Spread user provided data (title, author, price, etc.)
        };

        books.push(newBook);
        await saveBooks(books); // Writes to file

        return NextResponse.json({ success: true, data: newBook }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 500 });
    }
}