import React from 'react';
import CreateTelegramPostForm from "../components/CreateTelegramPostForm.jsx";
import {Divider} from "antd";
import UploadXLSXForm from "../components/UploadXLSXForm.jsx";
import { useAuth } from '../context/AuthContext';
import ConfirmAccount from '../components/ConfirmAccount.jsx';
import useTitle from '../hooks/useTitle.js';

const CreatePost = () => {
  useTitle('Создание поста');
  const { accessToken, refreshToken, updateTokens } = useAuth();

  const fetchWithAuth = async (url, options = {}) => {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    let response = await fetch(url, options);
    if (response.status === 401) {
      const refreshResponse = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: refreshToken })
      });
      const refreshResult = await refreshResponse.json();
      updateTokens(refreshResult.access_token, refreshToken);
      options.headers['Authorization'] = `Bearer ${refreshResult.access_token}`;
      response = await fetch(url, options);
    }
    return response;
  };

  return (
      <>
        <div>
           <h2>Создание поста</h2>
            <CreateTelegramPostForm fetchWithAuth={fetchWithAuth}/>
            <Divider/>
            <UploadXLSXForm fetchWithAuth={fetchWithAuth}/>
        </div>
      </>
  );
};

export default CreatePost;