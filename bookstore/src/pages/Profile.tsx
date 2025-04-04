import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneno: string;
  roletype: string;
}

interface JwtPayload {
  id: string;
  [key: string]: any;
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

  const decodeJWT = (token: string): JwtPayload => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid token format');
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          navigate('/login');
          return;
        }

        const decodedToken = decodeJWT(authToken);
        const userId = decodedToken.id;
        
        if (!userId) {
          throw new Error('User ID not found in token');
        }

        const response = await fetch('http://localhost:5400/api/usercrud/getuserbyid', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify({ id: userId })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Failed to fetch user data');
        }

        const userData: UserProfile = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          phoneno: userData.phoneno
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        if (err.message.includes('Invalid token') || err.message.includes('User ID not found')) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken || !user) return;

      // Validate password change if password field is filled
      if (formData.password && !formData.old_password) {
        setPasswordError('Old password is required to change password');
        return;
      }

      const response = await fetch('http://localhost:5400/api/usercrud/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          id: user.id,
          ...formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const result = await response.json();
      setUser(result.updated_user);
      setIsEditing(false);
      setPasswordError('');
    } catch (err: any) {
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
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6">
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? 'Edit Profile' : 'Profile Settings'}
            </h1>
          </div>

          <div className="grid md:grid-cols-3 gap-8 p-8">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-indigo-600"
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
                </div>
                <button className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Change Avatar
                </button>
              </div>
            </div>

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
                    className={`w-full px-4 py-3 border rounded-lg ${
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
                    className={`w-full px-4 py-3 border rounded-lg ${
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
                    className={`w-full px-4 py-3 border rounded-lg ${
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
                    value={user?.roletype || ''}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    readOnly
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
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-200"
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
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-200"
                        placeholder="Required if changing password"
                      />
                      {passwordError && (
                        <p className="mt-1 text-sm text-red-500">{passwordError}</p>
                      )}
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
                  <>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Log Out
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;