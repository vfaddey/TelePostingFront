import { Button, Layout, Menu } from 'antd';
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import CreatePost from "./pages/CreatePost.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { useAuth } from "./context/AuthContext";
import MyBots from "./pages/MyBots.jsx";
import MyChannels from "./pages/MyChannels.jsx"
import MyPosts from "./pages/MyPosts";
import Profile from "./pages/Profile"; 
import { EditOutlined, ProfileOutlined, RobotOutlined, FileTextOutlined, AppstoreOutlined, EditFilled, RobotFilled, AppstoreFilled, FileTextFilled, ProfileFilled } from '@ant-design/icons';
import logo from './images/logo.png'

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
          <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '64px' }} />
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<EditFilled style={{color: '#eab000'}}/>}>
            <Link to="/create_post">Создание поста</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<RobotFilled style={{color: '#eab000'}}/>}>
            <Link to="/bots">Мои боты</Link>
          </Menu.Item>
          <Menu.Item key="3"  icon={<AppstoreFilled style={{color: '#eab000'}}/>}>
            <Link to="/channels">Мои Каналы</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FileTextFilled style={{color: '#eab000'}}/>}>
            <Link to="/posts">Мои посты</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<ProfileFilled style={{color: '#eab000'}}/>}>
            <Link to="/profile">Профиль</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ marginLeft: '16px' }}>
            {username ? (
              <>
                <span style={{ marginRight: '16px' }}>{username}</span>
                <Button type="primary" onClick={logout}>Выйти</Button>
              </>
            ) : (
              <Link to="/login" >Войти</Link>
            )}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
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
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>LeetPost ©2024 by Fadde</Footer>
      </Layout>
    </Layout>
  );
}

export default App;
