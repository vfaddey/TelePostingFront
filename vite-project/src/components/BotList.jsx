import React, { useEffect, useState } from 'react';
import {List, Button, Card, Typography, notification, message} from 'antd';
import Icon, {DeleteOutlined} from "@ant-design/icons";

const { Text } = Typography;

const BotList = ({fetchWithAuth}) => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetchWithAuth('/api/bots/', {method: 'GET'});
        const data = await response.json();
        setBots(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось получить список ботов',
        });
        setLoading(false);
      }
    };

    fetchBots();
  }, []);

  const handleSetActive = async (apiToken) => {
    try {
      const response = await fetchWithAuth('/api/bots/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_token: apiToken }),
      });
      const result = await response.json();

      if (response.ok) {
        notification.success({
          message: 'Успех',
          description: 'Бот успешно установлен активным',
        });
        setBots((prevBots) =>
          prevBots.map((bot) =>
            bot.api_token === apiToken ? { ...bot, active: true } : { ...bot, active: false }
          )
        );
      } else {
        message.error(result.detail || 'Не удалось установить активного бота');
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error.message || 'Не удалось установить активного бота',
      });
    }
  };

  const handleDelete = async (apiToken) => {
    try {
      const response = await fetchWithAuth(`/api/bots/${apiToken}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notification.success({
          message: 'Успех',
          description: 'Бот успешно удален',
        });
        setBots((prevBots) => prevBots.filter((bot) => bot.api_token !== apiToken));
      } else {
        const result = await response.json();
        message.error(result.detail || 'Не удалось удалить бота');
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error.message || 'Не удалось удалить бота',
      });
    }
  };

  return (
    <Card title="Управление ботами" loading={loading}>
      <List
        dataSource={bots}
        renderItem={(bot) => (
          <List.Item
            actions={[
              <Button
                type={bot.active ? 'primary' : 'default'}
                onClick={() => handleSetActive(bot.api_token)}
              >
                {bot.active ? 'Активный' : 'Сделать активным'}
              </Button>,
              <Button onClick={() => navigator.clipboard.writeText(bot.api_token)}>
                Копировать API токен
              </Button>,
              <Button danger onClick={() => handleDelete(bot.api_token)}>
                <DeleteOutlined />
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`Бот: ${bot.api_token}`}
              description={`Статус: ${bot.active ? 'Активный' : 'Неактивный'}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default BotList;
