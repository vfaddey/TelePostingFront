import React from 'react';
import { Layout, Typography, Row, Col, Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import botImage from '../images/bot_example.png'; 
import channelImage from '../images/channel_example.png';
import postImage from '../images/post_example.png';
import backgroundImage from '../images/background.jpg';
import logoImage from '../images/logo_2.png'; 
import { RightCircleFilled, RobotFilled, EditFilled, AppstoreFilled } from '@ant-design/icons';
import useTitle from '../hooks/useTitle';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const HomePage = () => {
  useTitle('LeetPost — сервис публикации постов в телеграме ⏱️');

  return (
    <Layout>
      <Content style={{ padding: '0' }}>
        <div style={{
          position: 'relative',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '100px 20px',
          textAlign: 'center',
          color: '#fff',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(255,169,94,0.8) 0%, rgba(0,0,0,0) 80%)',
            clipPath: 'circle(60% at center)',
            zIndex: 1
          }}></div>
          <img src={logoImage} alt="LeetPost Logo" style={{ width: '80%', maxWidth: '300px', marginBottom: '20px', position: 'relative', zIndex: 2 }} />
          <Title level={1} style={{ color: '#fff', position: 'relative', zIndex: 2 }}>Добро пожаловать в LeetPost!</Title>
          <Paragraph style={{ color: '#fff', fontSize: '18px', position: 'relative', zIndex: 2 }}>
            LeetPost - это приложение для управления постами в Telegram.
          </Paragraph>
          <Link to="/dashboard/login">
            <Button type="primary" size="large" style={{ position: 'relative', zIndex: 2 }}><RightCircleFilled /> Get Started</Button>
          </Link>
        </div>
        <div style={{ background: '#f0f2f5', padding: '24px 10px', minHeight: 380 }}>
          <Title style={{ textAlign: 'center', marginBottom: 20 }} level={2}>Возможности LeetPost</Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 30, fontSize: '16px' }}>
            С помощью нашего сервиса вы можете:
          </Paragraph>
          <Row justify="center" gutter={[16, 16]} style={{ textAlign: 'center', marginBottom: 50 }}>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <RobotFilled style={{ fontSize: '50px', color: '#21b600', marginBottom: '15px' }} />
                <Card.Meta title="Добавлять ботов для управления каналами" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <AppstoreFilled style={{ fontSize: '50px', color: '#21b600', marginBottom: '15px' }} />
                <Card.Meta title="Добавлять каналы, где хотите публиковать сообщения" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable>
                <EditFilled style={{ fontSize: '50px', color: '#21b600', marginBottom: '15px' }} />
                <Card.Meta title="Создавать посты с выбором каналов для публикации" />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt="Post example" src={postImage} />}
              >
                <Card.Meta title="Создание Поста" description="Удобный конструктор поста" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt="Bot example" src={botImage} />}
              >
                <Card.Meta title="Боты" description="Выбранный вами бот будет публиковать сообщения в ваших телеграм каналах, когда вы захотите" />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={<img alt="Channel example" src={channelImage} />}
              >
                <Card.Meta title="Каналы" description="В одно нажатие ваш канал будет перенесен сюда" />
              </Card>
            </Col>
          </Row>
          <div style={{textAlign: 'center'}}>
            <Paragraph style={{ textAlign: 'center', marginBottom: 30, fontSize: '16px' }}>
              Начни пользоваться LeetPost прямо сейчас!
            </Paragraph>
            <Link to="/dashboard/login">
              <Button type="primary" size="large" style={{ position: 'relative', zIndex: 2 }}><RightCircleFilled /> Get Started</Button>
            </Link>
          </div>
          
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;
