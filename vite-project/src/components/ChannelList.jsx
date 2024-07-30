import React, { useEffect, useState } from 'react';
import {List, Button, Card, Typography, notification, message, Avatar} from 'antd';
import Icon, {DeleteOutlined} from "@ant-design/icons";

const { Text } = Typography;

const ChannelList = ({fetchWithAuth}) => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarError, setAvatarError] = useState({});

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await fetchWithAuth('/api/channels/', {method: 'GET'});
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
      const response = await fetchWithAuth(`/api/channels/${username}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notification.success({
          message: 'Успех',
          description: 'Канал успешно удален',
        });
        setChannels((prevChannles) => prevChannles.filter((channel) => channel.username !== username));
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

  const getAvatarUrl = (username) => {
    return `https://t.me/i/userpic/320/${username.replace('@', '')}.jpg`;
  };

  const handleAvatarError = (username) => {
    setAvatarError(prevState => ({ ...prevState, [username]: true }));
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
              avatar={
                avatarError[channel.username] ? (
                  <Avatar icon={<UserOutlined />} />
                ) : (
                  <Avatar 
                    size={'large'}
                    src={getAvatarUrl(channel.username)} 
                    onError={() => handleAvatarError(channel.username)} 
                  /> 
                )
              }
              title={<a href={`https://t.me/${channel.username.replace('@', '')}`} target="_blank" rel="noopener noreferrer">{channel.title}</a>}
              description={`${channel.username}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ChannelList;
