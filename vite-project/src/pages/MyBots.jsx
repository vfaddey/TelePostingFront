import React, {useState} from 'react';
import { useAuth } from '../context/AuthContext';
import AddBotForm from "../components/AddBotForm.jsx";
import BotList from "../components/BotList.jsx";
import {Divider} from "antd";

const MyBots = () => {
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
          <h2>Мои боты</h2>
          <BotList fetchWithAuth={fetchWithAuth}/>
          <Divider/>
          <AddBotForm fetchWithAuth={fetchWithAuth}/>
      </>
  );
};

export default MyBots;