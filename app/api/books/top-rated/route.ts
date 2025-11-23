import { NextResponse } from 'next/server';
import { getBooks } from '@/lib/dataHelpers';

export async function GET() {
    try {
        const books = await getBooks();

        // Sort by (rating * reviewCount) descending to find popular books
        const topBooks = books
            .map((book) => ({
                ...book,
                popularityScore: book.rating * book.reviewCount
            }))
            .sort((a, b) => b.popularityScore - a.popularityScore)
            .slice(0, 10);

        return NextResponse.json({ success: true, data: topBooks });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch top books' }, { status: 500 });
    }
}