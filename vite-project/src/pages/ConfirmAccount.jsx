import React, { useState } from 'react';
import { Modal, Button, Input, notification } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const ConfirmAccountModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempKey, setTempKey] = useState('');
  const { accessToken, refreshToken, updateTokens } = useAuth();

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

  const showModal = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/auth/confirm', {method: 'GET'});
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      setTempKey(`/confirm ${data.temp_key}`);
      setIsModalVisible(true);
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error.message || 'Неизвестная ошибка',
      });
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    checkUserStatus();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkUserStatus = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:8000/auth/users/me');
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      if (data.verified) {
        window.location.reload();
      } else {
        notification.warning({
          message: 'Подтверждение не завершено',
          description: 'Пожалуйста, подтвердите ваш аккаунт через телеграм бот.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось проверить статус пользователя',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempKey);
    notification.success({
      message: 'Скопировано',
      description: 'Ключ подтверждения скопирован в буфер обмена',
    });
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Подтвердить аккаунт
      </Button>
      <Modal
        title="Подтверждение аккаунта"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ОК"
        cancelText="Отмена"
      >
        <p>Отправьте следующую строку вашему телеграм боту для подтверждения аккаунта:</p>
        <Input
          value={tempKey}
          readOnly
          addonAfter={
            <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
              Копировать
            </Button>
          }
        />
      </Modal>
    </>
  );
};

export default ConfirmAccountModal;
