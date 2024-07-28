import React, { useEffect, useState } from 'react';
import { Card, Spin, notification, List, Avatar } from 'antd';
import {CheckCircleTwoTone, UserOutlined} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import ConfirmAccountModal from './ConfirmAccount';

const Profile = () => {
  const { accessToken, refreshToken, updateTokens } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState({});


  const fetchWithAuth = async (url, options = {}) => {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    let response = await fetch(url, options);
    if (response.status === 401) {
      const refreshResponse = await fetch('http://localhost:8000/auth/refresh', {
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/auth/users/me');
        console.log(response)
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        notification.error({
          message: 'Ошибка',
          description: error.message || 'Неизвестная ошибка',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <Spin />;
  }

  const getAvatarUrl = (username) => {
    return `https://t.me/i/userpic/320/${username.replace('@', '')}.jpg`;
  };

  const handleAvatarError = (username) => {
    setAvatarError(prevState => ({ ...prevState, [username]: true }));
  };


  return (
    <Card title="Профиль" style={{ width: '100%' }}>
      <p><strong>Имя пользователя:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      {userData.telegram_username && <p><CheckCircleTwoTone twoToneColor={"#21b600"}/> <strong>Telegram:</strong> @{userData.telegram_username}</p>}
      {!userData.verified && <ConfirmAccountModal />}
      {userData.channels && (
        <List
          itemLayout="horizontal"
          dataSource={userData.channels}
          renderItem={channel => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  avatarError[channel.username] ? (
                    <Avatar icon={<UserOutlined />} />
                  ) : (
                    <Avatar 
                      size={'large'}
                      src={getAvatarUrl(channel.username)} 
                      onError={() => handleAvatarError(channel.username)} 
                    /> 
                  )
                }
                title={<a href={`https://t.me/${channel.username.replace('@', '')}`} target="_blank" rel="noopener noreferrer">{channel.title}</a>}
                description={channel.username}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default Profile;
