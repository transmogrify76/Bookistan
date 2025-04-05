import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  price: number;
  genre: string;
  description: string;
  rating: number;
  pages: number;
  language: string;
  publisher: string;
  year: number;
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const navigate = useNavigate();

  const checkAuth = () => {
    return !!localStorage.getItem('authToken');
  };

  const books: Book[] = Array.from({ length: 32 }, (_, index) => {
    const id = index + 1;
    const isEven = id % 2 === 0;
    
    return {
      id,
      title: isEven ? "The Monk who Sold his Ferrari" : "Wish I Could Tell You",
      author: isEven ? "Robin Sharma" : "Durjoy Dutta",
      image: isEven
        ? "https://m.media-amazon.com/images/I/61OByUf1TfL.jpg"
        : "https://m.media-amazon.com/images/I/91R5TW7tdzL.jpg",
      price: isEven ? 349 : 299,
      genre: isEven ? "Self-Help" : "Romance",
      description: isEven 
        ? "A spiritual self-help classic about living with greater courage, balance, abundance and joy. The Monk Who Sold His Ferrari tells the extraordinary story of Julian Mantle, a lawyer forced to confront the spiritual crisis of his out-of-balance life."
        : "An emotional story about love, loss and the power of human connection. Wish I Could Tell You is a poignant tale that explores the deepest emotions of the human heart through its beautifully crafted characters.",
      rating: Math.floor(Math.random() * 2) + 4, 
      pages: isEven ? 198 : 256,
      language: "English",
      publisher: isEven ? "HarperCollins" : "Penguin Random House",
      year: isEven ? 1999 : 2015
    };
  });

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (selectedGenre === 'All' || book.genre === selectedGenre)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">

      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">BookSwap</span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Browse</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Donate</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">Community</a>
                <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">About</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button  className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={() => window.location.href = '/help'}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Help</span>
              </button>

  
              {checkAuth() && (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )}

              {checkAuth() ? (
                <button
                  onClick={() => {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all"
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
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Discover Your Next <span className="text-amber-300">Reading</span> Adventure
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto"
          >
            Find your next favorite book from our curated collection of bestsellers and hidden gems.
          </motion.p>
          
          <motion.div 
            className="relative max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              placeholder="Search books, authors, or genres..."
              className="w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-xl border border-white/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 text-gray-800 placeholder-gray-500 transition-all shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-2 top-2 p-2 bg-amber-400 hover:bg-amber-500 rounded-lg transition-colors">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </motion.div>

          <motion.div 
            className="mt-6 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {['All', 'Self-Help', 'Romance', 'Fiction', 'Non-Fiction'].map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre 
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                {genre}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredBooks.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block p-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-800">No books found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
              >
                Reset Filters
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
            {filteredBooks.map(book => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100"
                onClick={() => setSelectedBook(book)}
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
                      {book.genre}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                      View Details
                    </button>
                    <button className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      
      <AnimatePresence>
        {selectedBook && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBook(null)}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="flex flex-col">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-md">
                    <img
                      src={selectedBook.image}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                      {selectedBook.rating.toFixed(1)} ★
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Price</span>
                      <p className="text-2xl font-bold text-gray-900">₹{selectedBook.price}</p>
                    </div>
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all">
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <button 
                    className="absolute -top-4 -right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    onClick={() => setSelectedBook(null)}
                  >
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-1">{selectedBook.title}</h2>
                    <p className="text-lg text-indigo-600 mb-4">by {selectedBook.author}</p>
                    
                    <div className="flex items-center mb-6 space-x-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-5 w-5 ${star <= selectedBook.rating ? 'text-amber-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-600">{selectedBook.rating.toFixed(1)} out of 5</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <p className="text-sm text-gray-500">Genre</p>
                        <p className="font-medium">{selectedBook.genre}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pages</p>
                        <p className="font-medium">{selectedBook.pages}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Language</p>
                        <p className="font-medium">{selectedBook.language}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Publisher</p>
                        <p className="font-medium">{selectedBook.publisher}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{selectedBook.year}</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedBook.description}</p>
                    </div>

                    <div className="flex space-x-4">
                      <button 
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:shadow-md text-white font-medium rounded-lg transition-all"
                        onClick={() => {
                          setSelectedBook(null);
                        }}
                      >
                        Buy Now
                      </button>
                      <button 
                        className="flex-1 py-3 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedBook(null);
                        }}
                      >
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full shadow-lg text-white hover:shadow-xl transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </motion.button>

      <footer className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BookSwap</h3>
              <p className="text-indigo-100">Discover your next reading adventure with our curated collection of books.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Browse Books</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">New Releases</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Bestsellers</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Authors</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-indigo-200 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-600 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-200">© 2023 BookSwap. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;