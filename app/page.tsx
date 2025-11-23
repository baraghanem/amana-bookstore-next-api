import Link from 'next/link';
// Assuming the utility file is accessible at '@/lib/dataHelpers'
import { Book } from '@/lib/dataHelpers'; 

// Function to fetch book data from the internal API route
async function getBooksData(): Promise<Book[]> {
  // In a real Vercel environment, you often need the full URL (e.g., process.env.VERCEL_URL),
  // but for local development and simplicity, we use the full localhost path.
  // This helps ensure the Server Component fetch works reliably.
  const res = await fetch('http://localhost:3000/api/books', { 
    // Disable caching to see changes instantly
    cache: 'no-store' 
  });
  
  if (!res.ok) {
    // Log the error and throw to handle it in the try/catch block
    console.error(`API Fetch Error: ${res.status} ${res.statusText}`);
    throw new Error('Failed to fetch data from API');
  }

  const result = await res.json();
  return result.data || [];
}

export default async function Home() {
  let books: Book[] = [];
  let error: string | null = null;
  
  try {
    books = await getBooksData();
  } catch (e) {
    console.error(e);
    error = 'Could not load book data. Please ensure your development server is running and the API routes are correctly set up.';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-10 font-sans">
      <header className="py-8 text-center border-b border-gray-200 dark:border-gray-700 mb-10 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400">
          Amana Bookstore Catalogue
        </h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          A simple interface powered by your Next.js local JSON API.
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Error Handling */}
        {error && (
          <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Book List Display */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {books.length > 0 ? (
              books.map((book) => (
                // Use a standard <a> tag to link to the raw API response for inspection
                <a 
                  key={book.id} 
                  href={`/api/books/${book.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 block cursor-pointer"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2" title={book.title}>
                      {book.title}
                    </h2>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">{book.author}</p>
                    
                    <div className="space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                      <p>
                        <strong className="font-semibold">Price:</strong> 
                        <span className="ml-1 text-lg font-extrabold text-green-600 dark:text-green-400">${book.price.toFixed(2)}</span>
                      </p>
                      <p>
                        <strong className="font-semibold">Rating:</strong> 
                        <span className="ml-1">{book.rating.toFixed(1)} / 5.0 ({book.reviewCount} reviews)</span>
                      </p>
                      <p>
                        <strong className="font-semibold">Published:</strong> 
                        <span className="ml-1">{book.datePublished}</span>
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {book.genre?.map(tag => (
                            <span key={tag} className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-500 dark:text-gray-400 p-8">
                No books found in the catalogue.
              </p>
            )}
          </div>
        )}
      </main>
      
      <footer className="mt-16 text-center text-gray-400 dark:text-gray-600 text-sm">
        <p>
          Data served from local JSON files via Next.js API Routes.
          <br/>
          (Click any book card to view the raw API response for that book ID.)
        </p>
      </footer>
    </div>
  );
}