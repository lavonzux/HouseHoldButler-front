import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@api/auth';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [emailValue, setEmailValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleBack = () => {
    if (step === 'reset') {
      setStep('email');
      form.resetFields();
    } else {
      navigate('/login');
    }
  };

  // 第一步：發送重設郵件
  const onEmailFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: values.email });
      setEmailValue(values.email);
      setStep('reset');
      message.success('重設郵件已發送！請檢查您的信箱，並輸入收到的重設驗證碼');
    } catch (error: any) {
      const msg = error.response?.data?.title ?? '發送失敗，請稍後再試';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // 第二步：重設密碼
  const onResetFinish = async (values: { resetCode: string; password: string }) => {
    setLoading(true);
    try {
      await authApi.resetPassword({
        email: emailValue,
        resetCode: values.resetCode,
        newPassword: values.password,
      });
      message.success('密碼重設成功！請使用新密碼重新登入');
      navigate('/login', { replace: true });
    } catch (error: any) {
      const msg = error.response?.data?.title ?? '重設失敗，請確認驗證碼是否正確';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(https://images.unsplash.com/photo-1670684684445-a4504dca0bbc?q=80&w=1766&auto=format&fit=crop)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(240, 244, 255, 0.25)', zIndex: 0 }} />

      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#1677ff', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img src="/houseHoldButlerLogo.png" alt="Logo" style={{ height: 40 }} />
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
              AI 智慧家庭管家
            </Title>
          </div>
        </div>

        {/* 返回 + 標題 */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} style={{ marginRight: 12 }} />
          <Title level={3} style={{ margin: 0 }}>
            {step === 'email' ? '重新設定密碼' : '設定您的密碼'}
          </Title>
        </div>

        {step === 'email' ? (
          <Form form={form} onFinish={onEmailFinish} layout="vertical">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '請輸入電子郵件' },
                { type: 'email', message: '請輸入有效的電子郵件格式' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#1677ff' }} />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block style={{ height: 48 }}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} onFinish={onResetFinish} layout="vertical">
            {/* 重設驗證碼 */}
            <Form.Item
              name="resetCode"
              label="重設驗證碼"
              rules={[{ required: true, message: '請輸入信箱收到的重設驗證碼' }]}
            >
              <Input
                prefix={<KeyOutlined style={{ color: '#1677ff' }} />}
                placeholder="請輸入重設驗證碼"
                size="large"
                autoComplete="off"
              />
            </Form.Item>

            {/* 新密碼 */}
            <Form.Item
              name="password"
              label="新密碼"
              rules={[
                { required: true, message: '請輸入新密碼' },
                { min: 8, max: 16, message: '密碼長度必須為 8-16 個字元' },
                { pattern: /[a-z]/, message: '至少一個小寫字母' },
                { pattern: /[A-Z]/, message: '至少一個大寫字母' },
                {
                  pattern: /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/,
                  message: '僅能使用英文、數字或常用標點符號',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#1677ff' }} />}
                placeholder="密碼"
                size="large"
              />
            </Form.Item>

            {/* 密碼規則說明（完全依照圖二） */}
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24, lineHeight: 1.6 }}>
              <div>至少一個小寫字母</div>
              <div>至少一個大寫字母</div>
              <div>8-16個字母</div>
              <div>僅能使用英文、數字或常用的標點符號。</div>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block style={{ height: 48 }}>
                下一步
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;