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
  const [cartQuantities, setCartQuantities] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const checkAuth = () => !!localStorage.getItem('authToken');

  const getUserFromToken = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      const userid = decoded.userid || decoded.userId || decoded.sub;
      const usercartid = decoded.usercartid || decoded.userCartId || decoded.cartId;
      if (!userid || !usercartid) return null;
      return { userid, usercartid };
    } catch (error) {
      console.error("Token error:", error);
      return null;
    }
  };

  const fetchWishlist = async () => {
    const userData = getUserFromToken();
    if (!userData) return;

    try {
      const response = await fetch("http://localhost:5400/api/wishops/fetchwishlistuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: userData.userid }),
      });

      if (!response.ok) throw new Error('Failed to fetch wishlist');
      
      const data = await response.json();
      setWishlistItems(data);
      fetchBooksDetails(data.map((item: WishlistItem) => item.book_id));
    } catch (err) {
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooksDetails = async (bookIds: string[]) => {
    try {
      const response = await fetch('http://localhost:5400/api/booksops/getallbookdata');
      const allBooks: any[] = await response.json();
      
      const wishlistBooks = allBooks
        .filter(book => bookIds.includes(book.id.toString()))
        .map(book => ({
          ...book,
          rating: Number(book.rating) || 0,
          image: book.picture_path
        }));
      
      setBooks(wishlistBooks);
    } catch (err) {
      setError('Failed to load book details');
    }
  };

  const handleAddToCart = async (book: Book, quantity: number = 1) => {
    const userData = getUserFromToken();
    if (!userData) return;

    const cartItem = {
      usercartid: userData.usercartid,
      userid: userData.userid,
      book_id: book.id.toString(),
      quantity,
      price: book.price,
    };

    try {
      const response = await fetch("http://localhost:5400/api/cartops/addtocart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        setCartQuantities(prev => ({ ...prev, [book.id]: quantity }));
        alert("Item added to cart successfully!");
      } else if (response.status === 409) {
        setCartQuantities(prev => ({ ...prev, [book.id]: 1 }));
      } else {
        const errorText = await response.text();
        alert("Error adding to cart: " + errorText);
      }
    } catch (error) {
      console.error("Cart error:", error);
      alert("An error occurred while adding the book to the cart.");
    }
  };

  const handleIncrementCart = async (book: Book, increment: number = 1) => {
    const userData = getUserFromToken();
    if (!userData) return;

    const incrementCartItem = {
      userid: userData.userid,
      usercartid: userData.usercartid,
      book_id: book.id.toString(),
      quantity: increment,
      price: book.price,
    };

    try {
      const response = await fetch("http://localhost:5400/api/cartops/incrementcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(incrementCartItem),
      });

      if (response.ok) {
        setCartQuantities(prev => ({
          ...prev,
          [book.id]: (prev[book.id] || 0) + increment
        }));
      }
    } catch (error) {
      console.error("Increment error:", error);
    }
  };

  const handleDecrementCart = async (book: Book, decrement: number = 1) => {
    const userData = getUserFromToken();
    if (!userData) return;

    const decrementCartItem = {
      userid: userData.userid,
      usercartid: userData.usercartid,
      book_id: book.id.toString(),
      quantity: decrement,
    };

    try {
      const response = await fetch("http://localhost:5400/api/cartops/decrementcart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decrementCartItem),
      });

      if (response.ok) {
        setCartQuantities(prev => ({
          ...prev,
          [book.id]: Math.max((prev[book.id] || 0) - decrement, 0)
        }));
      }
    } catch (error) {
      console.error("Decrement error:", error);
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    const userid = getUserFromToken()?.userid;
    if (!userid) return;

    try {
      await fetch("http://localhost:5400/api/wishcrud/addtowishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: bookId, userid }),
      });
      fetchWishlist();
      alert("Removed from wishlist!");
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove from wishlist");
    }
  };

  useEffect(() => {
    const fetchCartQuantities = async () => {
      const userData = getUserFromToken();
      if (!userData) return;

      try {
        const response = await fetch(`http://localhost:5400/api/cartops/getcart/${userData.usercartid}`);
        if (response.ok) {
          const cartItems = await response.json();
          const quantities = cartItems.reduce((acc: { [key: string]: number }, item: any) => {
            acc[item.book_id] = item.quantity;
            return acc;
          }, {});
          setCartQuantities(quantities);
        }
      } catch (error) {
        console.error("Error fetching cart quantities:", error);
      }
    };

    fetchWishlist();
    fetchCartQuantities();
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
              <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">BookSwap</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => navigate('/')} className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Browse
                </button>
                <button onClick={() => navigate('/donate')} className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Donate
                </button>
                <button onClick={() => navigate('/profile')} className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Profile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/cart')} className="p-1 rounded-full hover:bg-gray-100 transition-colors relative">
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {Object.values(cartQuantities).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {Object.values(cartQuantities).reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
              {checkAuth() ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all text-sm"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all text-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-wide"
          >
            Your <span className="text-amber-300">Wishlist</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto"
          >
            {books.length > 0 
              ? `Curated collection of your ${books.length} favorite books`
              : 'Your wishlist is currently empty'}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {books.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block p-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
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
                    {cartQuantities[book.id] > 0 ? (
                      <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm w-full">
                        <button
                          onClick={() => handleDecrementCart(book, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={cartQuantities[book.id]}
                          readOnly
                          className="w-10 text-center text-sm font-semibold text-gray-800 bg-white outline-none"
                        />
                        <button
                          onClick={() => handleIncrementCart(book, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(book, 1)}
                        className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Add to Cart
                      </button>
                    )}
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

      <footer className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BookSwap</h3>
              <p className="text-indigo-100">
                Discover your next reading adventure with our curated collection of books.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/')} className="text-indigo-200 hover:text-white transition-colors">
                    Browse Books
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/donate')} className="text-indigo-200 hover:text-white transition-colors">
                    Donate
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/profile')} className="text-indigo-200 hover:text-white transition-colors">
                    Profile
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/help')} className="text-indigo-200 hover:text-white transition-colors">
                    Help Center
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/contact')} className="text-indigo-200 hover:text-white transition-colors">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/faq')} className="text-indigo-200 hover:text-white transition-colors">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('/privacy')} className="text-indigo-200 hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/terms')} className="text-indigo-200 hover:text-white transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-600 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-200">© 2024 BookSwap. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <button className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WishlistPage;