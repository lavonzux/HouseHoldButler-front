import React, { useState } from 'react';
import { 
  Card, Form, Input, Button, Typography, Divider, Space, Checkbox, 
  message 
} from 'antd';
import { 
  LockOutlined, UserOutlined, GoogleOutlined, FacebookOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '@api/auth';
import { useAuth } from '@/context/AuthContext';

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);
    try {
      await authApi.login({ email: values.email, password: values.password, rememberMe: values.remember ?? false });
      const me = await authApi.getMe();
      if (me) {
        login(me);
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';
        navigate(from, { replace: true });
      } else {
        message.error('登入後無法取得使用者資訊，請重試');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const msg = axiosError?.response?.data?.message ?? '登入失敗，請確認帳號與密碼';
      message.error(msg);
    } finally {
      setLoading(false);
    }
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#1677ff', cursor: 'pointer' }}
               onClick={() => navigate('/')}>
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
            name="email"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入有效的電子郵件格式' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1677ff' }} />}
              placeholder="電子郵件"
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
              <Link style={{ color: '#1677ff' }} onClick={() => navigate('/forgotPassword')}>忘記密碼？</Link>
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