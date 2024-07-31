import React, {useState} from 'react';
import { useAuth } from '../context/AuthContext';
import {Divider} from "antd";
import ChannelList from '../components/ChannelList';
import AddChannelForm from '../components/AddChannelForm';
import useTitle from '../hooks/useTitle';

const MyChannels = () => {
  useTitle('Мои каналы');
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
          <h2>Мои каналы</h2>
          <ChannelList fetchWithAuth={fetchWithAuth}/>
          <Divider/>
          <AddChannelForm fetchWithAuth={fetchWithAuth}/>
      </>
  );
};

export default MyChannels;