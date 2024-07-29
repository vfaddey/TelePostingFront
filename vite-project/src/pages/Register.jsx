import React, {useState} from 'react';
import {useAuth} from "../context/AuthContext.jsx";
import {message, Spin} from "antd";
import {useNavigate} from "react-router-dom";
import RegisterForm from "../components/RegisterForm.jsx";

const Register = () => {
  const { updateTokens } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.ok) {
        updateTokens(result.access_token, result.refresh_token);
        message.success('Регистрация успешна');
        navigate('/create_post');
      } else {
        message.error(result.detail || 'Ошибка регистрации');
      }
    } catch (error) {
      message.error('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Регистрация</h2>
        <RegisterForm onFinish={onFinish} buttonText="Зарегистрироваться" />
      </div>
    </Spin>
  );
};

export default Register;