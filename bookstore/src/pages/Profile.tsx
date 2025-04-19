import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneno: string;
  role: string;
}

interface UpdateFormData {
  name?: string;
  email?: string;
  phoneno?: string;
  password?: string;
  old_password?: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({});
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return decoded.id || decoded.userId || decoded.userid || decoded.sub || null;
    } catch (err) {
      console.error('Token decode failed:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userId = getUserIdFromToken();
        if (!userId) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        const response = await fetch(
          'http://localhost:5400/api/usercrud/getuserbyid',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: userId })
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch profile');
        }

        const userData: UserProfile = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phoneno: userData.phoneno
        });
      } catch (err: any) {
        console.error('Profile fetch error:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token || !user) return;

      if (formData.password && !formData.old_password) {
        setPasswordError('Old password is required to change password');
        return;
      }

      const payload = { id: user.id, ...formData };
      const response = await fetch(
        'http://localhost:5400/api/usercrud/updateprofile',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Update failed');
      }

      const result = await response.json();
      setUser(result.updated_user);
      setIsEditing(false);
      setPasswordError('');
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-100 max-w-md">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
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
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Browse
                </a>
                <a href="/donate" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Donate
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  Community
                </a>
                <a href="/about" className="text-gray-700 hover:text-indigo-600 transition-colors font-medium">
                  About
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="hidden lg:flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors text-sm px-2 py-1"
                onClick={() => window.location.href = '/help'}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>Help</span>
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg text-white font-medium hover:shadow-md transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-wide"
          >
            Profile <span className="text-amber-300">Settings</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto"
          >
            Manage your account details and security settings
          </motion.p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="grid md:grid-cols-3 gap-8 p-8">
            {/* Avatar Section */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-48 h-48 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden shadow-md"
                >
                  <svg
                    className="w-32 h-32 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </motion.div>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  Update Avatar
                </button>
              </div>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    value={isEditing ? formData.name || '' : user?.name || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-200'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={isEditing ? formData.email || '' : user?.email || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-200'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    name="phoneno"
                    type="tel"
                    value={isEditing ? formData.phoneno || '' : user?.phoneno || ''}
                    onChange={handleInputChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isEditing
                        ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-200'
                        : 'border-gray-300 bg-gray-50 cursor-not-allowed'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        name="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                        placeholder="Leave blank to keep current"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <input
                        name="old_password"
                        type="password"
                        value={formData.old_password || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                        placeholder="Required for changes"
                      />
                      {passwordError && <p className="mt-2 text-sm text-red-500">{passwordError}</p>}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setPasswordError('');
                        setFormData({
                          name: user?.name,
                          email: user?.email,
                          phoneno: user?.phoneno
                        });
                      }}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
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
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Browse Books
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    New Releases
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Bestsellers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Authors
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
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
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="text-indigo-200 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM13.5 8.5c0-1.38-1.119-2.5-2.5-2.5s-2.5 1.12-2.5 2.5 1.119 2.5 2.5 2.5 2.5-1.12 2.5-2.5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;