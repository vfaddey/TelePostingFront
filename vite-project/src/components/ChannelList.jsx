import React, { useEffect, useState } from 'react';
import {List, Button, Card, Typography, notification, message} from 'antd';
import Icon, {DeleteOutlined} from "@ant-design/icons";

const { Text } = Typography;

const ChannelList = ({fetchWithAuth}) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8000/channels', {method: 'GET'});
        const data = await response.json();
        setChannels(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось получить список каналов',
        });
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  const handleDelete = async (username) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/channels/${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notification.success({
          message: 'Успех',
          description: 'Канал успешно удален',
        });
        setBots((prevChannles) => prevBots.filter((channel) => channel.username !== username));
      } else {
        const result = await response.json();
        message.error(result.detail || 'Не удалось удалить канал');
      }
    } catch (error) {
      notification.error({
        message: 'Ошибка',
        description: error.message || 'Не удалось удалить канал',
      });
    }
  };

  return (
    <Card title="Управление каналами" loading={loading}>
      <List
        dataSource={channels}
        renderItem={(channel) => (
          <List.Item
            actions={[
              <Button onClick={() => navigator.clipboard.writeText(channel.username)}>
                Копировать юзернейм
              </Button>,
              <Button danger onClick={() => handleDelete(channel.username)}>
                <DeleteOutlined />
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={`${channel.title}`}
              description={`${channel.username}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ChannelList;
