import React from 'react'
import BookCard from '../components/BookCard'

interface Book {
  id: number
  title: string
  author: string
  image: string
  price: number
}

// Dummy data for demonstration
const books: Book[] = [
  {
    id: 1,
    title: "Modern JavaScript",
    author: "John Doe",
    image: "https://via.placeholder.com/300x200",
    price: 29.99
  },
  {
    id: 2,
    title: "Learning React",
    author: "Jane Smith",
    image: "https://via.placeholder.com/300x200",
    price: 34.99
  },
  // Add more books as needed
]

const Home = () => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">BookSwap</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Home</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Browse</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Sell</a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition">Profile</a>
              </div>
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                Login
              </button>
            </div>
          </div>
        </nav>
  
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Discover Your Next Favorite Book</h1>
            <p className="text-xl mb-8">Buy, sell, and exchange books with readers worldwide</p>
            <div className="max-w-2xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Search for books, authors, or genres..."
                className="w-full px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="absolute right-2 top-2 bg-indigo-600 text-white px-8 py-2 rounded-full hover:bg-indigo-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
  
        {/* Featured Books Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Book Cards */}
            {[1,2,3,4].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                <img 
                  src="https://via.placeholder.com/300x400" 
                  alt="Book cover" 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">The Great Novel</h3>
                  <p className="text-gray-600 mb-2">Author Name</p>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-600 font-bold">$14.99</span>
                    <button className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-200 transition">
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BookSwap</h3>
              <p className="text-gray-400">Connecting readers worldwide through the love of books.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  };
  
  export default Home;
