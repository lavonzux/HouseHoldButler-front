// src/pages/Landing.tsx
import React, { useRef } from 'react';
import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { LoginOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const features = [
  {
    title: "智能庫存管理",
    description: "即時追蹤家中物品數量，自動計算剩餘天數，永遠知道什麼快用完了。",
    icon: "📦",
  },
  {
    title: "自動補貨提醒",
    description: "當庫存低於安全值或即將用完時，自動推播通知，再也不會臨時缺貨。",
    icon: "🛒",
  },
  {
    title: "AI 智慧建議",
    description: "根據你的使用習慣，提供最適合的購買建議與預算規劃。",
    icon: "🤖",
  },
  {
    title: "多裝置同步",
    description: "手機、平板、電腦隨時查看與更新，全家人都能共同管理。",
    icon: "📱",
  },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  // 新增：用來指向「核心功能」區塊
  const featuresRef = useRef<HTMLDivElement>(null);

  // 新增：處理平滑滾動的函式
  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'    // 讓區塊頂部對齊視窗頂部
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)' }}>
      {/* Navbar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'white',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          zIndex: 1000,
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1677ff', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/houseHoldButlerLogo.png" alt="AI 管家 Logo" style={{ height: 32, width: 'auto', display: 'block' }} />
          AI 智慧家庭管家
        </div>

        <Space>
          <Button type="link" onClick={scrollToFeatures}>功能特色</Button>
          <Button type="link">價格方案</Button>
          <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate('/dashboard')}>
            登入
          </Button>
        </Space>
      </div>

      {/* Hero Section */}
      <div style={{ 
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden'
        }}>
          {/* 背景影片 */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',           // 填滿容器，保持比例
            zIndex: 1,
          }}
        >
          <source 
            src="https://www.pexels.com/download/video/4121744/" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* 深色半透明遮罩，讓文字更清晰 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.45)',   // 調整透明度 0.4~0.6 都很常見
            zIndex: 2,
          }}
        />

        {/* 文字內容層 */}
        <div 
          style={{
            position: 'relative',
            zIndex: 3,
            maxWidth: 900,
            padding: '0 24px',
          }}
        >
          <Title 
            level={1} 
            style={{ 
              fontSize: '3.8rem', 
              marginBottom: 32,
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: '#ffffff' }}>讓生活更有條理</span>
            <br />
            <span style={{ color: '#a5d8ff' }}>AI 智慧家庭管家</span>
          </Title>
          
          <Paragraph 
            style={{ 
              fontSize: '1.38rem', 
              maxWidth: 720,
              margin: '0 auto 48px',
              opacity: 0.95,
              lineHeight: 1.6,
            }}
          >
            <span style={{ color: '#ffffff' }}>自動追蹤庫存、智慧提醒補貨、AI 消費建議，</span>
            <br />
            <span style={{ color: '#ffffff' }}>讓你輕鬆管理家中每一樣物品，再也不用擔心缺貨或浪費。</span>
          </Paragraph>
          
          <Button
            type="primary"
            size="large"
            icon={<ArrowRightOutlined />}
            onClick={() => navigate('/login')}
            style={{ 
              height: 56, 
              fontSize: 20, 
              padding: '0 48px',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(22, 119, 255, 0.35)',
            }}
          >
            立即體驗
          </Button>
        </div>
      </div>

      {/* Features */}
      <div id="features" ref={featuresRef} style={{ padding: '80px 40px', background: 'white', scrollMarginTop: '80px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
          核心功能
        </Title>
        <Row gutter={[32, 32]} justify="center">
          {features.map((feature, idx) => (
            <Col xs={24} sm={12} lg={6} key={idx}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center', borderRadius: 12 }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <div style={{ fontSize: 48, marginBottom: 24 }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {feature.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Footer */}
      <div style={{ padding: '60px 40px', textAlign: 'center', background: '#001529', color: 'white' }}>
        <Title level={4} style={{ color: 'white' }}>
          AI 智慧家庭管家 - 讓家庭生活更聰明
        </Title>
        <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
          © 2026 AI HouseKeeper. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default Landing;