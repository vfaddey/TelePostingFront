import React, {useEffect, useState} from 'react';
import LoginForm from "../components/LoginForm.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {message, Spin} from "antd";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const { updateTokens } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = new URLSearchParams();
      data.append('username', values.email);
      data.append('password', values.password);

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        updateTokens(result.access_token, result.refresh_token);
        message.success('Вход выполнен успешно');
        navigate('/create_post');
      } else {
        message.error(result.detail || 'Ошибка входа');
      }

    } catch (error) {
      console.log(error)
      message.error('Ошибка сервера!')
    } finally {
      setLoading(false);
    }

  };

  return (
      <Spin spinning={loading}>
        <div>
          <h2>Login</h2>
          <LoginForm onFinish={onFinish} buttonText="Login" />
        </div>
      </Spin>

  );
};

export default Login;
