import React, { useState, useEffect } from 'react';
import { Layout, Menu, Badge, Input, Button, theme, Drawer, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SearchOutlined,
  MenuOutlined,
  UserOutlined
} from '@ant-design/icons';

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

    // Update cart count whenever localStorage changes
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('storage', updateCartCount);
    
    // Initial cart count
    updateCartCount();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  return (
    <Layout className="min-h-screen bg-white">
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: isMobile ? '0 16px' : '0 50px',
          background: '#000000',
          height: '72px',
        }}
      >
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined className="text-white" />}
            onClick={() => setOpen(true)}
            className="mr-4"
          />
        )}
        
        <Link to="/" className="no-underline">
          <div className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'} mr-6`}>
            TCL Store
          </div>
        </Link>

        {!isMobile && (
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="flex-1 min-w-0 border-none bg-black"
            theme="dark"
          >
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="/products" icon={<AppstoreOutlined />}>
              <Link to="/products">Products</Link>
            </Menu.Item>
          </Menu>
        )}

        <Space size={isMobile ? 8 : 16}>
          {!isMobile && (
            <Search 
              placeholder="Search products..." 
              className="w-64 pt-4 rounded-full"
            />
          )}
          <Link to="/cart">
            <Badge count={cartCount}>
              <Button type="text" icon={<ShoppingCartOutlined className="text-white text-xl" />} />
            </Badge>
          </Link>
          <Button type="text" icon={<UserOutlined className="text-white text-xl" />} />
        </Space>
      </Header>

      {isMobile && (
        <div className="p-3 bg-white border-b border-gray-200">
          <Search placeholder="Search products..." className="w-full" />
        </div>
      )}

      <Content className={`${isMobile ? 'p-4' : 'p-6'} bg-gray-50`}>
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
          {children}
        </div>
      </Content>

      <Footer className="text-center bg-black text-white py-6">
        <div className="max-w-7xl mx-auto">
          TCL Online Store ©{new Date().getFullYear()}
        </div>
      </Footer>

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        width={280}
        className="bg-white"
      >
        <Menu 
          mode="vertical" 
          selectedKeys={[location.pathname]}
          className="border-none"
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