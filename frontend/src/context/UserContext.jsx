import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
    contact: '',
    skills: [],
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await res.json();
      
      setUser({
        name: data.name || '',
        email: data.email || '',
        role: data.role || '',
        location: data.location || '',
        contact: data.contact || '',
        skills: data.skills || [],
        avatarUrl: data.avatarUrl || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, loading, refetchUser: fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};