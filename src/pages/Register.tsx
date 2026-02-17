// src/pages/Register.tsx
import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Divider,
  Space,
  Checkbox,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const onFinish = (values: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
  }) => {
    if (!agreed) {
      message.error('請勾選「我已詳閱並同意」相關條款');
      return;
    }

    setLoading(true);

    // 模擬註冊 API 延遲
    setTimeout(() => {
      setLoading(false);
      message.success('註冊成功！請登入');
      navigate('/login');
      // 實際專案應呼叫後端註冊 API，並處理錯誤情況
    }, 1500);
  };

  // 台灣手機號碼常見格式驗證（09開頭 + 8碼）
  const phoneValidator = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('請輸入電話號碼'));
    }
    if (!/^09[0-9]{8}$/.test(value)) {
      return Promise.reject(new Error('請輸入正確的手機號碼格式（09開頭共10碼）'));
    }
    return Promise.resolve();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          'url(https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=968&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* 半透明遮罩 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(240, 244, 255, 0.25)',
          zIndex: 0,
        }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          overflow: 'hidden',
        }}
      >
        {/* 標題區 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#1677ff' }}>
            <img
              src="/houseHoldButlerLogo.png"
              alt="AI 管家 Logo"
              style={{ height: 40, width: 'auto' }}
            />
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
              AI 智慧家庭管家
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: 16, marginTop: 8, display: 'block' }}>
            請輸入會員資料
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          {/* Email */}
          <Form.Item
            name="email"
            label="電子郵件 (email)"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入正確的電子郵件格式' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#1677ff' }} />}
              placeholder="請輸入您的電子郵件"
              size="large"
            />
          </Form.Item>

          {/* 密碼 */}
          <Form.Item
            name="password"
            label="密碼"
            rules={[
              { required: true, message: '請輸入密碼' },
              { min: 8, message: '密碼長度至少 8 個字元' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1677ff' }} />}
              placeholder="請設定您的密碼"
              size="large"
            />
          </Form.Item>

          {/* 確認密碼 */}
          <Form.Item
            name="confirmPassword"
            label="確認密碼"
            dependencies={['password']}
            rules={[
              { required: true, message: '請再次輸入密碼' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('兩次輸入的密碼不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1677ff' }} />}
              placeholder="請再次輸入密碼"
              size="large"
            />
          </Form.Item>

          {/* 姓名 */}
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#1677ff' }} />}
              placeholder="請輸入您的姓名"
              size="large"
            />
          </Form.Item>

          {/* 手機號碼 */}
          <Form.Item
            name="phone"
            label="電話號碼"
            rules={[{ validator: phoneValidator }]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#1677ff' }} />}
              placeholder="請輸入手機號碼（09xxxxxxxx）"
              size="large"
              maxLength={10}
            />
          </Form.Item>

          {/* 同意條款 */}
          <Form.Item>
            <div style={{ margin: '16px 0' }}>
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              >
                我已詳閱並同意
                <Link style={{ color: '#1677ff', margin: '0 4px' }}>AI 智慧家庭管家使用者條款</Link>
                及
                <Link style={{ color: '#1677ff', marginLeft: 4 }}>隱私權政策</Link>
              </Checkbox>
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
              disabled={!agreed}
            >
              同意並加入
            </Button>
          </Form.Item>

          <Divider plain>或</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              已經有帳號？ <Link onClick={() => navigate('/login')}>立即登入</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;