import { NextResponse, NextRequest } from 'next/server';
import { getBooks } from '@/lib/dataHelpers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params;
    const books = await getBooks();

    // Find the book by its ID
    const book = books.find((b) => b.id === resolvedParams.id);

    if (!book) {
        return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book });
}