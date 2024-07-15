// src/components/PostCard.js
import React, { useEffect, useState } from 'react';
import { Card } from 'antd';

const { Meta } = Card;

const PostCard = ({ post, onClick, fetchWithAuth }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    const fetchPhoto = async (photoId) => {
      try {
        const response = await fetchWithAuth(`http://localhost:8000/create_post/photo/${photoId}`, {method: 'GET'});
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log(url)
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
  }, [post.photo_ids]);

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={photoUrl && <img alt="post" src={photoUrl} />}
      onClick={() => onClick(post)}
    >
      <Meta title={post.text} description={post.publish_time} />
    </Card>
  );
};

export default PostCard;
