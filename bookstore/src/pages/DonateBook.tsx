import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {jwtDecode} from 'jwt-decode';
import bgImage from '/src/assets/images/bgi/bgi.jpg';

type Subcategory = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  subcategory: Subcategory[];
};

type DecodedToken = {
  user_id: string; // adjust this based on your token structure
};

const DonateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [userID, setUserID] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookPicture, setBookPicture] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState('');
  const [selectedSubcategoryID, setSelectedSubcategoryID] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Decode the token and set the userID on mount.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserID(decoded.user_id); // adjust property name if needed
      } catch (err) {
        console.error('Failed to decode token:', err);
        setError('Invalid token');
      }
    }
  }, []);

  // Load categories on mount.
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5400/api/booksops/loadcategories');
        if (!response.ok) {
          throw new Error('Failed to load categories');
        }
        const data: Category[] = await response.json();
        setCategories(data);
        if (data.length > 0) {
          // Set default category and subcategory.
          setSelectedCategoryID(data[0].id);
          if (data[0].subcategory && data[0].subcategory.length > 0) {
            setSelectedSubcategoryID(data[0].subcategory[0].id);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load categories');
      }
    };

    loadCategories();
  }, []);

  // Update subcategory when category changes.
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatID = e.target.value;
    setSelectedCategoryID(newCatID);
    const selectedCat = categories.find((cat) => cat.id === newCatID);
    if (selectedCat && selectedCat.subcategory.length > 0) {
      setSelectedSubcategoryID(selectedCat.subcategory[0].id);
    } else {
      setSelectedSubcategoryID('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Create a FormData instance to send multipart/form-data.
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    formData.append('user_id', userID);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category_id', selectedCategoryID);
    formData.append('subcategory_id', selectedSubcategoryID);

    if (bookFile) {
      formData.append('book_file', bookFile);
    } else {
      setError('Book file is required');
      return;
    }
    if (bookPicture) {
      formData.append('book_picture', bookPicture);
    }

    try {
      const response = await fetch('http://127.0.0.1:5400/api/booksops/uploadbooksdata', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || 'Upload failed');
        return;
      }

      const data = await response.json();
      setSuccessMsg(data.message);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative" style={{ marginLeft: '-30px' }}>
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-bold text-gray-900"
          >
            Donate Your Book
          </motion.h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Want to donate a book? Fill in the details below.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
          <div className="bg-white py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-100">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {successMsg && <p className="text-green-500 text-sm mb-4">{successMsg}</p>}
            <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Book Title"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <div className="mt-1">
                  <input
                    id="author"
                    name="author"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Book Author"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Short description of the book"
                  />
                </div>
              </div>

              {/* Since the userID is automatically set from the token, we remove the manual input field */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="mt-1">
                    <input
                      id="price"
                      name="price"
                      type="text"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="e.g., 0 (for donation)"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="mt-1">
                    <input
                      id="quantity"
                      name="quantity"
                      type="text"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      placeholder="Number of copies"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={selectedCategoryID}
                    onChange={handleCategoryChange}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subcategory_id" className="block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <select
                    id="subcategory_id"
                    name="subcategory_id"
                    value={selectedSubcategoryID}
                    onChange={(e) => setSelectedSubcategoryID(e.target.value)}
                    required
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    {categories.find((cat) => cat.id === selectedCategoryID)?.subcategory.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    )) || <option value="">No subcategory available</option>}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="book_file" className="block text-sm font-medium text-gray-700">
                  Book File (PDF)
                </label>
                <div className="mt-1">
                  <input
                    id="book_file"
                    name="book_file"
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setBookFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="book_picture" className="block text-sm font-medium text-gray-700">
                  Book Picture (optional)
                </label>
                <div className="mt-1">
                  <input
                    id="book_picture"
                    name="book_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBookPicture(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:text-sm file:font-semibold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Donate Book
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateBook;
