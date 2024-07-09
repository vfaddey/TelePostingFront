import React, {createContext, useState, useEffect, useContext} from 'react';
import jwtDecode from "jwt-decode";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [username, setUsername] = useState('');


  useEffect(() => {
    if (accessToken) {
      console.log(accessToken)
      const decoded = jwtDecode(accessToken);
      console.log(decoded)
      setUsername(decoded.sub);
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ accessToken, refreshToken, updateTokens, logout, username}}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
