import { NextResponse, NextRequest } from 'next/server';
import { getReviews, saveReviews, getBooks, saveBooks, Review } from '@/lib/dataHelpers';
import { isAuthenticated } from '@/lib/auth';

// GET Reviews for a specific book
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const reviews = await getReviews();

    // Filter reviews matching the book ID
    const bookReviews = reviews.filter((r) => r.bookId === resolvedParams.id);

    return NextResponse.json({ success: true, count: bookReviews.length, data: bookReviews });
}

// POST a new review
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Authentication Check
    if (!isAuthenticated(request)) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Missing or invalid x-api-key' }, { status: 401 });
    }

    const resolvedParams = await params;

    try {
        const body = await request.json();
        const reviews = await getReviews();
        const books = await getBooks();

        // 1. Create new review object
        const newReview: Review = {
            id: `review-${Date.now()}`,
            bookId: resolvedParams.id,
            timestamp: new Date().toISOString(),
            verified: false,
            ...body, // User provides: author, rating, comment, title
        };

        reviews.push(newReview);
        await saveReviews(reviews);

        // 2. Update Book Statistics (Rating & Review Count)
        const bookIndex = books.findIndex((b) => b.id === resolvedParams.id);

        if (bookIndex !== -1) {
            // Recalculate average
            const allBookReviews = reviews.filter((r) => r.bookId === resolvedParams.id);
            const totalRating = allBookReviews.reduce((sum, r) => sum + r.rating, 0);
            const avgRating = totalRating / allBookReviews.length;

            books[bookIndex].rating = Number(avgRating.toFixed(1)); // Keep one decimal place
            books[bookIndex].reviewCount = allBookReviews.length;

            await saveBooks(books);
        }

        return NextResponse.json({ success: true, data: newReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to add review' }, { status: 500 });
    }
}