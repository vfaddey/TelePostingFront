import React from 'react';
import { Form, Input, Button } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const RegisterForm = ({ onFinish, buttonText }) => {
  return (
    <Form
      name="auth_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: 300, margin: 'auto' }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Укажите Ваш ник' }]}
      >
        <Input prefix={<UserOutlined/>} placeholder="Ник" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Укажите e-mail' }]}
      >
        <Input prefix={<MailOutlined/>} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Укажите пароль' }]}
      >
        <Input.Password  prefix={<LockOutlined/>} placeholder="Пароль" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
