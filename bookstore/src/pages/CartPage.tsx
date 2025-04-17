import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  picture_path: string;
  price: number;
  pages: string;
  language: string;
  publisher: string;
  year: string;
}

interface CartItem {
  cart_id: string;
  quantity: number;
  price: number;
  book: Book;
}

interface UserData {
  userid: string;
  usercartid: string;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const navigate = useNavigate();

  const checkAuth = (): boolean => !!localStorage.getItem('authToken');

  const getUserFromToken = (): UserData | null => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return null;
    }
    try {
      const decoded: any = jwtDecode(token);
      return {
        userid: decoded.userid || decoded.userId || '',
        usercartid: decoded.usercartid || decoded.cartId || ''
      };
    } catch (err) {
      console.error('Token error:', err);
      navigate('/login');
      return null;
    }
  };

  const fetchCartItems = async () => {
    const userData = getUserFromToken();
    if (!userData) return;
    try {
      const response = await fetch('http://localhost:5400/api/cartops/getallcartofuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usercartid: userData.usercartid }),
      });
      if (!response.ok) throw new Error('Failed to fetch cart items');
      const items: CartItem[] = await response.json();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    try {
      const item = cartItems.find((i) => i.cart_id === cartId);
      if (!item) return;
      const userData = getUserFromToken();
      const response = await fetch('http://localhost:5400/api/cartops/incrementcart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cartId,
          quantity: newQuantity,
          usercartid: userData?.usercartid,
          book_id: item.book.id,
          price: item.price,
        }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCartItems();
    } catch (err) {
      console.error('Quantity update error:', err);
      alert('Failed to update quantity');
    }
  };

  const calculateTotal = (): number =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateOrder = async () => {
    const userData = getUserFromToken();
    if (!userData) return;
    if (!address.trim()) {
      alert('Please enter a delivery address');
      return;
    }
    try {
      const response = await fetch('http://localhost:5400/api/orderops/createorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: userData.userid,    // send actual user ID
          deliveryaddress: address,
        }),
      });
      if (!response.ok) throw new Error('Order creation failed');
      await response.json();
      // Notify user, clear cart, and redirect home
      alert('Order placed successfully!');
      setCartItems([]);
      navigate('/');
    } catch (err) {
      console.error('Create order error:', err);
      alert('Failed to create order');
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full"
      />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-red-500 text-xl font-medium">{error}</div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
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
                <button className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Community
                </button>
                <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  About
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors text-sm px-2 py-1"
                onClick={() => navigate('/help')}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Help</span>
              </button>
              {checkAuth() && (
                <button
                  onClick={() => navigate('/profile')}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-900"
        >
          Your <span className="text-indigo-600">Cart</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.cart_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-gray-100"
              >
                <div className="flex items-start">
                  <img
                    src={`data:image/jpeg;base64,${item.book.picture_path}`}
                    alt={item.book.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                  <div className="ml-6 flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{item.book.title}</h3>
                    <p className="text-indigo-600 mt-1">by {item.book.author}</p>
                    <div className="mt-4 text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Pages:</span> {item.book.pages}</p>
                      <p><span className="font-medium">Language:</span> {item.book.language}</p>
                      <p><span className="font-medium">Publisher:</span> {item.book.publisher} ({item.book.year})</p>
                    </div>
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 text-gray-900 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xl font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-b from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl h-fit sticky top-24"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>

            <div className="space-y-4 mb-4">
              <label className="block text-gray-100 font-medium">Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-md p-2"
                rows={3}
                placeholder="Enter your delivery address"
              />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-200">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-200">
                <span>Shipping</span>
                <span className="text-green-400">FREE</span>
              </div>
            </div>

            <div className="border-t border-indigo-500 pt-6 mb-6">
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total</span>
                <span>₹{calculateTotal().toLocaleString()}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 py-4 rounded-xl font-bold transition-colors"
              onClick={handleCreateOrder}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
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
                <li><button onClick={() => navigate('/')} className="text-indigo-200 hover:text-white transition-colors">Browse Books</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">New Releases</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Bestsellers</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Authors</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/about')} className="text-indigo-200 hover:text-white transition-colors">About Us</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Careers</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Blog</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><button className="text-indigo-200 hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Terms of Service</button></li>
                <li><button className="text-indigo-200 hover:text-white transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-indigo-600 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-200">© 2023 BookSwap. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              {/* Social icons */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CartPage;
