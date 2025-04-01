import React from 'react'

interface BookCardProps {
  title: string
  author: string
  image: string
  price: number
}

const BookCard: React.FC<BookCardProps> = ({ title, author, image, price }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600">{author}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-green-600 font-bold">${price}</span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Buy
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard
