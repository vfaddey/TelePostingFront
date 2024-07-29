import React, { useEffect, useState } from 'react';
import {Card, Button, Popconfirm, message} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Meta } = Card;

const PostCard = ({ post, onClick, fetchWithAuth, onDelete }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async (photoId) => {
      try {
        const response = await fetchWithAuth(`/api/create_post/photo/${photoId}`, { method: 'GET' });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
      } catch (error) {
        message.error(`Не получилось получить фотографию с id:  ${photoId}`, error);
        return '';
      }
    };

    const fetchPhotos = async () => {
      if (post.photo_ids.length > 0) {
        const photoUrl = await fetchPhoto(post.photo_ids[0]);
        setPhotoUrl(photoUrl);
      }
    };

    fetchPhotos();
  }, [post.photo_ids, fetchWithAuth]);

  const formatPublishTime = (publishTime) => {
    return moment(publishTime).add(3, 'hours').format('YYYY-MM-DD HH:mm');
  };

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={photoUrl && <img alt="post" src={photoUrl} />}
      actions={[
        <Popconfirm
          title="Вы уверены, что хотите удалить пост?"
          onConfirm={(e) => {
            e.stopPropagation();
            onDelete(post.id);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText="Да"
          cancelText="Нет"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            type="text"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>,
      ]}
      onClick={() => onClick(post)}
    >
      <Meta
        title={<span style={{ fontWeight: 'normal' }}>{post.text}</span>}
        description={(
          <>
            <div>Дата публикации: {formatPublishTime(post.publish_time)}</div>
            {post.delete_time && <div>Дата удаления: {moment(post.delete_time).format('YYYY-MM-DD HH:mm')}</div>}
            <div>Каналы: {post.channels.join(', ')}</div>
          </>
        )}
      />
    </Card>
  );
};

export default PostCard;
