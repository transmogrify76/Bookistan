import { FC } from 'react';

interface BookCardProps {
  title: string;
  author: string;
  image: string;
  price: number;
}

const BookCard: FC<BookCardProps> = ({ title, author, image, price }) => {
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl 
      transition-all duration-300 hover:-translate-y-2 relative">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt="Book cover" 
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-all duration-300"
        />
        <div className="absolute top-2 right-2 bg-indigo-100 text-indigo-600 px-3 py-1 
          rounded-full text-sm font-medium">
          Bestseller
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-2">{author}</p>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-bold text-lg">
            ₹{price.toLocaleString('en-IN')}
          </span>
          <button className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg 
            hover:bg-indigo-200 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            Quick View
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;