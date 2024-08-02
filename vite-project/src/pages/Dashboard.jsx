import { Button, Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './Register.jsx';
import Login from './Login';
import CreatePost from "./CreatePost.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import { useAuth } from "../context/AuthContext";
import MyBots from "./MyBots.jsx";
import MyChannels from "./MyChannels.jsx";
import MyPosts from "./MyPosts";
import Profile from "./Profile";
import { EditFilled, RobotFilled, AppstoreFilled, FileTextFilled, ProfileFilled, MenuOutlined } from '@ant-design/icons';
import logo from '../images/logo_2.png';
import small_logo from '../images/logo_small_2.png'
import NotFound from './NotFound';

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const { username, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSiderVisible, setIsSiderVisible] = useState(true);

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      setCollapsed(true);
      setIsSiderVisible(false);
    } else {
      setIsMobile(false);
      setCollapsed(false);
      setIsSiderVisible(true);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setIsSiderVisible(!isSiderVisible);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isSiderVisible && (
        <Sider style={{background: "#041e37"}} collapsible collapsed={collapsed} onCollapse={setCollapsed}>
          <div className="logo" style={{ padding: '16px', textAlign: 'center' }}>
            {!collapsed ? (
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '64px'}} />
            ): (
              <img src={small_logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '64px'}} />
            )}
          </div>
          <Menu style={{background: "#041e37"}} theme="dark" mode="inline">
            <Menu.Item key="1" icon={<EditFilled style={{color: '#eab000'}}/>}>
              <Link to="/dashboard/create_post">Создание поста</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<RobotFilled style={{color: '#eab000'}}/>}>
              <Link to="/dashboard/bots">Мои боты</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<AppstoreFilled style={{color: '#eab000'}}/>}>
              <Link to="/dashboard/channels">Мои Каналы</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FileTextFilled style={{color: '#eab000'}}/>}>
              <Link to="/dashboard/posts">Мои посты</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<ProfileFilled style={{color: '#eab000'}}/>}>
              <Link to="/dashboard/profile">Профиль</Link>
            </Menu.Item>
          </Menu>
        </Sider>
      )}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button
                type="primary"
                onClick={toggleCollapsed}
                style={{ marginLeft: '16px' }}
              >
                <MenuOutlined />
              </Button>
            )}
            {username ? (
              <span style={{ marginLeft: '16px' }}>{username}</span>
            ) : (
              <Link to="/dashboard/login" style={{ marginLeft: '16px' }}>Войти</Link>
            )}
          </div>
          {username && (
            <Button type="primary" onClick={logout} style={{ marginRight: '16px' }}>
              Выйти
            </Button>
          )}
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
              <Route path="create_post" element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              }/>
              <Route path="bots" element={
                <PrivateRoute>
                  <MyBots/>
                </PrivateRoute>
              } />
              <Route path="channels" element={
                <PrivateRoute>
                  <MyChannels/>
                </PrivateRoute>
              } />
              <Route path="posts" element={
                <PrivateRoute>
                  <MyPosts/>
                </PrivateRoute>
              } />
              <Route path="profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>LeetPost ©2024 by Faddey</Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;
