// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { 
  Image, Card, Form, Input, Button, Typography, Divider, Space, Checkbox, 
  message 
} from 'antd';
import { 
  LockOutlined, UserOutlined, GoogleOutlined, FacebookOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth'});
  }, []);

  const onFinish = (values: { username: string; password: string; remember?: boolean }) => {
    setLoading(true);
    
    // 模擬登入延遲（實際應呼叫 API）
    setTimeout(() => {
      setLoading(false);
      message.success('登入成功！');
      // 實際專案中應儲存 token 或使用 auth context
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        backgroundImage: `url(https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?q=80&w=1766&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative', // 如果之後要疊加其他元素
    }}
    >
        {/* 加一層半透明遮罩，讓文字更容易閱讀 */}
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(240, 244, 255, 0.25)', // 淺藍色半透，與原本漸層接近
      zIndex: 0,
    }}
  />
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 420, 
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* 標題區 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#1677ff' }}>
            <img src="/houseHoldButlerLogo.png" alt="AI 管家 Logo" style={{ height: 40, width: 'auto'}} />
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
              AI 智慧家庭管家
            </Title>
        </div>
          <Text type="secondary">歡迎回來，請登入您的帳戶</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '請輸入手機 / 電子郵件 / 使用者名稱' }]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#1677ff' }} />}
              placeholder="手機 / Email / 使用者名稱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '請輸入密碼' }]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#1677ff' }} />}
              placeholder="密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>記住我</Checkbox>
              </Form.Item>
              <Link style={{ color: '#1677ff' }}>忘記密碼？</Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              loading={loading}
              block
              style={{ height: 48, fontSize: 16 }}
            >
              登入
            </Button>
          </Form.Item>

          <Divider plain>或使用以下方式登入</Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button 
              icon={<GoogleOutlined />} 
              block 
              size="large"
              style={{ height: 48 }}
            >
              使用 Google 登入
            </Button>
            
            <Button 
              icon={<FacebookOutlined style={{ color: '#1877f2' }} />} 
              block 
              size="large"
              style={{ height: 48 }}
            >
              使用 Facebook 登入
            </Button>
          </Space>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Text type="secondary">
              還沒有帳號？ <Link onClick={() => navigate('/register')}>立即註冊</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;