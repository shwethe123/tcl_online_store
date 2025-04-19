import React, { useState, useEffect } from 'react';
import {
  Layout,
  Menu,
  Badge,
  Input,
  Button,
  Drawer,
  Space
} from 'antd';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
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

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          padding: isMobile ? '0 16px' : '0 40px',
          background: '#141414',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: 'white', fontSize: 20 }} />}
              onClick={() => setOpen(true)}
              style={{ marginRight: 12 }}
            />
          )}

          <Link to="/" style={{ color: 'white', fontSize: 22, fontWeight: 'bold', textDecoration: 'none' }}>
            TCL Store
          </Link>

          {!isMobile && (
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              theme="dark"
              style={{ marginLeft: 40, background: 'transparent', borderBottom: 'none' }}
            >
              <Menu.Item key="/" icon={<HomeOutlined />}>
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="/products" icon={<AppstoreOutlined />}>
                <Link to="/products">Products</Link>
              </Menu.Item>
            </Menu>
          )}
        </div>

        <Space size={isMobile ? 8 : 16}>
          {!isMobile && (
            <Search
              placeholder="Search products..."
              allowClear
              style={{ width: 250 }}
              className="rounded pt-4"
            />
          )}

          <Link to="/cart">
            <Badge count={cartCount} size="small">
              <ShoppingCartOutlined style={{ color: 'white', fontSize: 20 }} />
            </Badge>
          </Link>

          <UserOutlined style={{ color: 'white', fontSize: 20 }} />
        </Space>
      </Header>

      {/* Mobile Search */}
      {isMobile && (
        <div style={{ padding: '12px 16px', background: 'white', borderBottom: '1px solid #eaeaea' }}>
          <Search placeholder="Search products..." allowClear />
        </div>
      )}

      {/* Main Content */}
      <Content style={{ padding: isMobile ? '16px' : '32px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: isMobile ? '16px' : '24px',
          background: 'white',
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {children}
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', background: '#141414', color: '#ffffff', marginTop: 24 }}>
        TCL Online Store ©{new Date().getFullYear()}
      </Footer>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={250}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          style={{ border: 'none' }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/products" icon={<AppstoreOutlined />}>
            <Link to="/products">Products</Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default MainLayout;
