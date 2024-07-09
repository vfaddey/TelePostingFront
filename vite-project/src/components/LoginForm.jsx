import React from 'react';
import { Form, Input, Button } from 'antd';

const LoginForm = ({ onFinish, buttonText }) => {
  return (
    <Form
      name="auth_form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      style={{ maxWidth: 300, margin: 'auto' }}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {buttonText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
