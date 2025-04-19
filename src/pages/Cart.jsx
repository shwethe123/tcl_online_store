import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  Button,
  InputNumber,
  Space,
  Card,
  Row,
  Col,
  Empty,
  message
} from 'antd';
import {
  DeleteOutlined,
  ShoppingOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
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
      item._id === record._id ? { ...item, quantity: value } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (record) => {
    const updatedCart = cartItems.filter(item => item._id !== record._id);
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
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < 576 ? 'column' : 'row',
            alignItems: 'center',
            gap: 8
          }}
        >
          <img
            src={record.imageUrls}
            alt={text}
            style={{
              width: 60,
              height: 60,
              objectFit: 'cover',
              borderRadius: 4
            }}
          />
          <Link to={`/product/${record._id}`}>
            <Text ellipsis style={{ maxWidth: 160 }}>{text}</Text>
          </Link>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      responsive: ['sm'],
      render: price => `฿${price.toFixed(2)}`,
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
          style={{ width: '50%' }}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      responsive: ['sm'],
      render: (_, record) => `฿${(record.price * record.quantity).toFixed(2)}`,
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
        style={{ padding: '40px 0' }}
      >
        <Link to="/products">
          <Button type="primary" icon={<ShoppingOutlined />}>
            Continue Shopping
          </Button>
        </Link>
      </Empty>
    );
  }

  return (
    <Space direction="vertical" size={24} style={{ width: '100%', padding: '16px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Shopping Cart</Title>

      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={cartItems}
          pagination={false}
          rowKey="_id"
          style={{ minWidth: 320 }}
        />
      </div>

      <Row justify="center" gutter={[16, 16]}>
        <Col xs={24} sm={20} md={16} lg={8}>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Subtotal:</Text>
                <Text strong>฿{calculateTotal().toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Shipping:</Text>
                <Text strong>Free</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total:</Text>
                <Title level={4} style={{ margin: 0 }}>
                  ฿{calculateTotal().toFixed(2)}
                </Title>
              </div>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button danger block onClick={clearCart}>
                  Clear Cart
                </Button>
                <Button
                  type="primary"
                  block
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigate('/checkout')}
                >
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
