import React from "react";
import { Layout, Button, Dropdown, Avatar, Space, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useAuth } from "@/context/AuthContext";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isLanding = location.pathname === "/";

  // 使用者下拉選單（已登入時顯示）
  const userDropdownItems: MenuProps["items"] = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "進入 Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "登出",
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 固定頂部導航列 */}
      <Header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: "white",
          borderBottom: "1px solid #e8e8e8",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          zIndex: 1000,
          boxShadow: "0 1px 4px rgba(0,21,41,0.08)",
        }}
      >
        {/* Logo + 品牌名稱 */}
        <div
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#1677ff",
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <img
            src="/houseHoldButlerLogo.png"
            alt="AI 管家 Logo"
            style={{ height: 32, width: "auto" }}
          />
          AI 智慧家庭管家
        </div>

        {/* 右側區域：功能連結 + 使用者狀態 */}
        <Space size="large" align="center">
          {/* 僅首頁顯示功能特色與價格方案 */}
          {isLanding && (
            <>
              <a
                href="#features"
                style={{ color: "#1677ff", textDecoration: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                功能特色
              </a>
              <a href="#" style={{ color: "#1677ff", textDecoration: "none" }}>
                價格方案
              </a>
              {/* 使用者狀態：登入 / 未登入 */}
              {user ? (
                <Dropdown
                  menu={{ items: userDropdownItems }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{ backgroundColor: "#1677ff", cursor: "pointer" }}
                    icon={<UserOutlined />}
                  />
                </Dropdown>
              ) : (
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                >
                  登入
                </Button>
              )}
            </>
          )}
        </Space>
      </Header>

      {/* 內容區域自動往下推 */}
      <Content style={{ paddingTop: 64, background: "transparent" }}>
        <Outlet />
      </Content>

      {/* Footer */}
      <div
        style={{
          padding: "60px 40px",
          textAlign: "center",
          background: "#001529",
          color: "white",
        }}
      >
        <Title level={4} style={{ color: "white" }}>
          AI 智慧家庭管家 - 讓家庭生活更聰明
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.65)" }}>
          © 2026 AI HouseKeeper. All rights reserved.
        </Text>
      </div>
    </Layout>
  );
};

export default PublicLayout;
