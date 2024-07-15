import { Button } from "antd";
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from "./pages/CreatePost.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useAuth } from "./context/AuthContext";
import MyBots from "./pages/MyBots.jsx";
import MyChannels from "./pages/MyChannels.jsx"
import MyPosts from "./pages/MyPosts";

const { Header, Content, Footer } = Layout;

function App() {
  const { username, logout } = useAuth();

  return (
    <Layout className="layout">
      <Header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/create_post">Create Post</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/register">Register</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to={"/bots"}>Боты</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to={"/channels"}>Каналы</Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link to={"/posts"}>Мои посты</Link>
          </Menu.Item>
        </Menu>
        <div>
          {username ? (
            <>
              <span style={{ color: 'white', marginRight: '16px' }}>{username}</span>
              <Button type="primary" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/create_post" element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }/>

            <Route path="/bots" element={
              <PrivateRoute>
                <MyBots/>
              </PrivateRoute>
            } />

            <Route path="/channels" element={
              <PrivateRoute>
                <MyChannels/>
              </PrivateRoute>
            } />

            <Route path="/posts" element={
              <PrivateRoute>
                <MyPosts/>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Your App ©2024 Created by You</Footer>
    </Layout>
  );
}

export default App;
