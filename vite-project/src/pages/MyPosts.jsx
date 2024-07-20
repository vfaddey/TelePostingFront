import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Row, Col } from 'antd';
import PostCard from '../components/PostCard';
import EditPostModal from '../components/EditPostModal';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { accessToken, refreshToken, updateTokens } = useAuth()

  const fetchWithAuth = async (url, options = {}) => {
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${accessToken}`;
    let response = await fetch(url, options);
    if (response.status === 401) {
      const refreshResponse = await fetch('http://localhost:8000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: refreshToken })
      });
      const refreshResult = await refreshResponse.json();
      updateTokens(refreshResult.access_token, refreshToken);
      options.headers['Authorization'] = `Bearer ${refreshResult.access_token}`;
      response = await fetch(url, options);
    }
    return response;
  };

  const fetchPosts = async () => {
    const response = await fetchWithAuth('http://localhost:8000/create_post', {method: 'GET'});
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedPost(null);
  };

  const handleSave = (updatedPost) => {
    setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {posts.map((post) => (
          <Col key={post.id} span={6}>
            <PostCard post={post} onClick={handleCardClick} fetchWithAuth={fetchWithAuth} />
          </Col>
        ))}
      </Row>
      {selectedPost && (
        <EditPostModal
          visible={isModalVisible}
          onClose={handleModalClose}
          post={selectedPost}
          onSave={handleSave}
          fetchWithAuth={fetchWithAuth}
        />
      )}
    </div>
  );
};

export default MyPosts;
