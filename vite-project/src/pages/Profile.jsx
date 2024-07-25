import React from 'react';
import { Card } from 'antd';
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { username, email } = useAuth();

  return (
    <Card title="Profile" style={{ width: '100%' }}>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Email:</strong> {email}</p>
    </Card>
  );
};

export default Profile;
