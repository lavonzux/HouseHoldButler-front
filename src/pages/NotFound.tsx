// src/pages/NotFound.tsx
import React from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { HomeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f0ff 100%)',
        padding: '24px',
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle={
          <Space direction="vertical" size="middle" align="center">
            <Title level={3} style={{ margin: 0, color: '#434343' }}>
              無法瀏覽這個頁面
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              不便之處，敬請見諒。
            </Text>
            <Text type="secondary" style={{ fontSize: 16 }}>
              請洽系統管理員
            </Text>
          </Space>
        }
        extra={
          <Space size="middle">
            <Button
              type="default"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              返回上一頁
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              回到首頁
            </Button>
          </Space>
        }
      />
    </div>
  );
};

export default NotFound;