import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  price: number;
  category_name: string;
  description: string;
  rating: number;
  pages: number;
  language: string;
  publisher: string;
  year: number;
}

interface WishlistItem {
  id: string;
  book_id: string;
  userid: string;
  addedtolist: boolean;
}

const WishlistPage = () => {
  const [, setWishlistItems] = useState<WishlistItem[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getUserFromToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return null;
    }
    let decoded: any = {};
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
    const userid = decoded.userid || decoded.userId || decoded.sub;
    if (!userid) {
      console.error("Token is missing userid");
      return null;
    }
    return userid;
  };

  const fetchWishlist = async () => {
    const userid = getUserFromToken();
    if (!userid) return;

    try {
      const response = await fetch("http://localhost:5400/api/wishops/fetchwishlistuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlistItems(data);
      fetchBooksDetails(data.map((item: WishlistItem) => item.book_id));
    } catch (err) {
      setError('Failed to load wishlist');
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksDetails = async (bookIds: string[]) => {
    try {
      const response = await fetch('http://localhost:5400/api/booksops/getallbookdata');
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const allBooks: any[] = await response.json();
      
      const wishlistBooks = allBooks
        .filter(book => bookIds.includes(book.id.toString()))
        .map(book => ({
          ...book,
          rating: book.rating !== undefined ? Number(book.rating) : 0,
          image: book.picture_path
        }));
      
      setBooks(wishlistBooks);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError('Failed to load book details');
    }
  };

  const handleAddToCart = async (book: Book) => {
    const userData = getUserFromToken();
    if (!userData) return;

    const cartItem = {
      usercartid: userData,
      userid: userData,
      book_id: book.id.toString(),
      quantity: 1,
      price: book.price,
    };

    try {
      const response = await fetch("http://localhost:5400/api/cartops/addtocart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert("Item added to cart successfully!");
      } else {
        const errorText = await response.text();
        alert("Error adding to cart: " + errorText);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred while adding the book to the cart.");
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    const userid = getUserFromToken();
    if (!userid) return;

    try {
      const response = await fetch("http://localhost:5400/api/wishcrud/addtowishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          userid: userid
        }),
      });

      if (response.ok) {
        fetchWishlist(); // Refresh the wishlist
        alert("Item removed from wishlist!");
      } else {
        const errorText = await response.text();
        alert("Error removing from wishlist: " + errorText);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("An error occurred while removing the book from wishlist.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-800">Error loading wishlist</h3>
              <p className="mt-2 text-gray-600">{error}</p>
              <button
                onClick={fetchWishlist}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
          <p className="text-gray-600">
            {books.length > 0 
              ? `You have ${books.length} item${books.length !== 1 ? 's' : ''} in your wishlist`
              : 'Your wishlist is currently empty'}
          </p>
        </motion.div>

        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-800">No items in wishlist</h3>
              <p className="mt-2 text-gray-600">Start adding books to your wishlist to see them here</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                Browse Books
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {books.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                    <h3 className="text-white font-semibold text-lg">{book.title}</h3>
                    <p className="text-gray-200 text-sm mt-1">{book.author}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                    {book.rating.toFixed(1)} ★
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">₹{book.price}</span>
                    <span className="text-xs font-medium px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {book.category_name}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between space-x-2">
                    <button 
                      onClick={() => handleAddToCart(book)}
                      className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleRemoveFromWishlist(book.id.toString())}
                      className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                      title="Remove from wishlist"
                    >
                      <svg
                        className="h-4 w-4 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;