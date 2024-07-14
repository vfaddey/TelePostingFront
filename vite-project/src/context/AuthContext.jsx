import React, {createContext, useState, useEffect, useContext} from 'react';
import jwtDecode from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
  const [username, setUsername] = useState('');


  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      setUsername(decoded.username);
    }
  }, [accessToken]);

  const updateTokens = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUsername('');
  };

  const autoLogin = async () => {
    if (refreshToken) {
      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000; // текущее время в секундах
          const bufferTime = 60 * 5; // 5 минут
          if (decoded.exp - currentTime > bufferTime) {
            return;
          }
        }

        let formData = new FormData();
        formData.append('token', refreshToken);
        const response = await fetch('http://localhost:8000/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: refreshToken }),
        });

        const result = await response.json();
        if (response.ok) {
          updateTokens(result.access_token, refreshToken);
        } else {
          logout();
        }
      } catch (error) {
        console.log(error);
        logout();
      }
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, updateTokens, logout, username}}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
