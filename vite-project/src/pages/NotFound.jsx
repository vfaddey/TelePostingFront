// src/pages/NotFoundPage.jsx
import React from 'react';
import { Result, Button } from 'antd';
import useTitle from '../hooks/useTitle';

const NotFound = () => {
  useTitle('404 Not Found');
  return (
    <Result
      status="404"
      title="404"
      subTitle="Извините, такой страницы не существует."
      extra={<Button type="primary" href='/dashboard/create_post'>Назад</Button>}
    />
  );
};

export default NotFound;
