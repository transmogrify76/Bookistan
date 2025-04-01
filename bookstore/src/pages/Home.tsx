import React from 'react'
import BookCard from '../components/BookCard'

interface Book {
  id: number
  title: string
  author: string
  image: string
  price: number
}

// Dummy data with Indian context
const books: Book[] = [
  {
    id: 1,
    title: "Modern JavaScript",
    author: "John Doe",
    image: "https://via.placeholder.com/300x200",
    price: 299
  },
  {
    id: 2,
    title: "Learning React",
    author: "Jane Smith",
    image: "https://via.placeholder.com/300x200",
    price: 349
  },
  // Add more books as needed
]

const Home = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Navbar with subtle animation */}
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  BookSwap
                </span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="relative text-gray-700 hover:text-indigo-600 transition-all 
                  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 
                  hover:after:w-full after:transition-all">
                  Home
                </a>
                <a href="#" className="relative text-gray-700 hover:text-indigo-600 transition-all 
                  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 
                  hover:after:w-full after:transition-all">
                  Browse
                </a>
                <a href="#" className="relative text-gray-700 hover:text-indigo-600 transition-all 
                  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 
                  hover:after:w-full after:transition-all">
                  Sell
                </a>
                <a href="#" className="relative text-gray-700 hover:text-indigo-600 transition-all 
                  after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-indigo-600 
                  hover:after:w-full after:transition-all">
                  Profile
                </a>
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-2 
                rounded-full hover:scale-105 transition-transform shadow-md hover:shadow-indigo-200">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section with Glassmorphism effect */}
        <div className="relative bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-down">
              Discover Your Next Favorite Book
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Buy, sell, and exchange books with readers across India
            </p>
            <div className="max-w-2xl mx-auto relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 shadow-lg">
                <input 
                  type="text" 
                  placeholder="Search for books, authors, or genres..."
                  className="w-full px-6 py-4 rounded-full bg-white/5 backdrop-blur-sm text-white 
                    placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="absolute right-4 top-3 bg-white text-indigo-600 px-6 py-2 
                  rounded-full hover:bg-gray-100 transition-all shadow-md">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Books Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div 
                key={book.id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl 
                  transition-all duration-300 hover:-translate-y-2 relative"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={book.image} 
                    alt="Book cover" 
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-600 px-3 py-1 
                    rounded-full text-sm font-medium">
                    Bestseller
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">{book.title}</h3>
                  <p className="text-gray-600 mb-2">{book.author}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-bold text-lg">
                      ₹{book.price.toLocaleString('en-IN')}
                    </span>
                    <button className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg 
                      hover:bg-indigo-200 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-gray-800 text-white pt-12 pb-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-300 bg-clip-text text-transparent">
                BookSwap
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Connecting book lovers across India. Discover, share, and fall in love with new stories every day.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-all flex items-center">
                  <span className="mr-2">→</span> About Us
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all flex items-center">
                  <span className="mr-2">→</span> Contact
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all flex items-center">
                  <span className="mr-2">→</span> FAQ
                </a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition-all">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-all">Return Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 BookSwap. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Home;