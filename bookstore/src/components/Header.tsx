import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">BookStore</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="text-gray-600 hover:text-gray-800">Home</a></li>
            <li><a href="/books" className="text-gray-600 hover:text-gray-800">Books</a></li>
            <li><a href="/contact" className="text-gray-600 hover:text-gray-800">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
