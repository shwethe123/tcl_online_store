import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Badge,
  Input,
  Button,
  Drawer,
  Row,
  Col,
  FloatButton
} from 'antd';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const MainLayout = ({ children }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', updateCartCount);
    updateCartCount();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const menuItems = [
    {
      key: '/',
      label: <Link to="/">Home</Link>,
      icon: <HomeOutlined />
    },
    {
      key: '/products',
      label: <Link to="/products">Products</Link>,
      icon: <AppstoreOutlined />
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header
        style={{
          background: '#ffffff',
          padding: isMobile ? '0 16px' : '0 64px',
          borderBottom: '1px solid #dcdcdc',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Row justify="space-between" align="middle" style={{ height: 64 }}>
          <Col>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {isMobile && (
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setOpenDrawer(true)}
                  style={{ marginRight: 12 }}
                />
              )}
              <Link to="/" style={{ fontSize: 24, fontWeight: 'bold', color: '#4A90E2' }}>
                TCL Store
              </Link>
            </div>
          </Col>
          <Col>
            {!isMobile && (
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ borderBottom: 'none' }}
                theme="light"
              />
            )}
          </Col>
          <Col>
            <div style={{ display: 'flex', gap: 16 }}>
              {!isMobile && (
                <Search placeholder="Search for products..." style={{ width: 240 }} allowClear />
              )}
              <Link to="/cart">
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined style={{ fontSize: 22, color: '#4A90E2' }} />
                </Badge>
              </Link>
              <UserOutlined style={{ fontSize: 22, color: '#4A90E2' }} />
            </div>
          </Col>
        </Row>
      </Header>

      {/* Mobile Search */}
      {isMobile && (
        <div style={{ padding: 12, background: '#ffffff', borderBottom: '1px solid #eaeaea' }}>
          <Search placeholder="Search..." allowClear />
        </div>
      )}

      {/* Main Content */}
      <Content style={{ padding: isMobile ? 16 : 40, background: '#f0f2f5' }}>
        <div style={{
          maxWidth: 1200,
          margin: 'auto',
          padding: isMobile ? 16 : 32,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
        }}>
          {children}
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', background: '#ffffff', color: '#888888' }}>
        © {new Date().getFullYear()} TCL Store — Designed with 💙 and React
      </Footer>

      {/* Drawer for Mobile Menu */}
      <Drawer
        title={<span style={{ color: '#4A90E2', fontWeight: 600 }}>Navigation</span>}
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Drawer>

      {/* Floating Cart Button (mobile/tablet only) */}
      {isMobile && (
        <Link to="/cart">
          <FloatButton
            icon={<ShoppingCartOutlined />}
            badge={{ count: cartCount }}
            style={{ right: 24, bottom: 80, backgroundColor: '#4A90E2', color: '#fff' }}
          />
        </Link>
      )}
    </Layout>
  );
};

export default MainLayout;
