import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, InputNumber, Space, Card, Row, Col, Empty, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (record, value) => {
    const updatedCart = cartItems.map(item =>
      item.id === record.id ? { ...item, quantity: value } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (record) => {
    const updatedCart = cartItems.filter(item => item.id !== record.id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    message.success('Cart cleared');
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <img
            src={record.image}
            alt={text}
            style={{ width: 80, height: 80, objectFit: 'cover' }}
          />
          <Link to={`/product/${record.id}`}>{text}</Link>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.stock || 10}
          value={record.quantity}
          onChange={(value) => updateQuantity(record, value)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record)}
        />
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Your cart is empty"
      >
        <Button type="primary" icon={<ShoppingOutlined />}>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </Empty>
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Title level={2}>Shopping Cart</Title>

      <Table
        columns={columns}
        dataSource={cartItems}
        pagination={false}
        rowKey="id"
      />

      <Row justify="end" gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Subtotal:</Text>
                <Text strong>${calculateTotal().toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Shipping:</Text>
                <Text strong>Free</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total:</Text>
                <Title level={4}>${calculateTotal().toFixed(2)}</Title>
              </div>
              
              <Space style={{ width: '100%' }}>
                <Button danger onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Cart;