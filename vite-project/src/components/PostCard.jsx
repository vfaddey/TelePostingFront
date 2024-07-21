// src/components/PostCard.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Meta } = Card;

const PostCard = ({ post, onClick, fetchWithAuth, onDelete }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async (photoId) => {
      try {
        const response = await fetchWithAuth(`http://localhost:8000/create_post/photo/${photoId}`, { method: 'GET' });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
      } catch (error) {
        console.error(`Failed to fetch photo with id ${photoId}`, error);
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

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={photoUrl && <img alt="post" src={photoUrl} />}
      actions={[
        <Popconfirm
          title="Are you sure to delete this post?"
          onConfirm={(e) => {
            e.stopPropagation();
            onDelete(post.id);
          }}
          onCancel={(e) => e.stopPropagation()}
          okText="Yes"
          cancelText="No"
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
      <Meta title={post.text} description={post.publish_time} />
    </Card>
  );
};

export default PostCard;
