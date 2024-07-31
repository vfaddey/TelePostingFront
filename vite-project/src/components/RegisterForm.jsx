import React from 'react';
import { Form, Input, Button } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const RegisterForm = ({ onFinish, buttonText }) => {
  const [form] = Form.useForm();

  const validatePasswords = (_, value) => {
    if (!value || form.getFieldValue('password') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Пароли не совпадают'));
  };

  return (
    <Form
      form={form}
      name="auth_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: 300, margin: 'auto' }}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Укажите Ваш ник' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Ник" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Укажите e-mail' }]}
      >
        <Input prefix={<MailOutlined />} placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Укажите пароль' }]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Подтвердите пароль',
          },
          {
            validator: validatePasswords,
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="Подтвердите пароль" />
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
