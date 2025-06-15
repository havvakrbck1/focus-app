import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../lib/api'; 
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  user_id: number;
  username: string;
}


interface AuthContextType {
  user: { username: string } | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logoutUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUser({ username: decoded.username });
      } catch (error) {
        console.error("Geçersiz token:", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await api.post('/token/', { username, password });
      const data = response.data;
      
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        const decoded: DecodedToken = jwtDecode(data.access);
        setUser({ username: decoded.username });
      }
    } catch (error) {
      console.error("Giriş sırasında hata:", error);
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Yükleniyor...</p> : children}
    </AuthContext.Provider>
  );
};