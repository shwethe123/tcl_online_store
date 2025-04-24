import React, { useState, useEffect } from 'react';
import {
  Typography, Form, Input, Button, Space, Card,
  Row, Col, Steps, Radio, Divider, message, Grid
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardOutlined, HomeOutlined, CheckCircleOutlined,
  LeftOutlined, RightOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;
const { useBreakpoint } = Grid;

const Checkout = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const validCart = parsedCart.map((item, index) => ({
        id: item.id || item._id || `item-${index}`,
        ...item
      }));
      setCartItems(validCart);
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async () => {
    const allValues = { ...formValues, ...form.getFieldsValue() };

    const orderData = {
      ...allValues,
      cartItems,
      total: calculateTotal(),
    };

    try {
      message.loading({ content: 'Processing your order...', key: 'order' });

      const response = await fetch('https://store-backend-9byz.onrender.com/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');
      await response.json();

      messageApi.success({
        content: 'Order placed successfully!',
        key: 'order',
        duration: 2,
      });

      localStorage.removeItem('cart');
      navigate('/');
    } catch (error) {
      console.error('Order error:', error);
      messageApi.error({
        content: 'Something went wrong while placing the order.',
        key: 'order',
        duration: 2,
      });
    }
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormValues(prev => ({ ...prev, ...values }));
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      console.log('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const steps = [
    {
      title: 'Shipping',
      icon: <HomeOutlined />,
      content: (
        <Space direction="vertical" size={screens.xs ? 16 : 24} style={{ width: '100%' }}>
          <Row gutter={screens.xs ? 0 : 16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: 'First name is required' },
                  { min: 2, message: 'At least 2 characters' },
                ]}
              >
                <Input size={screens.xs ? 'large' : 'middle'} placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: 'Last name is required' },
                  { min: 2, message: 'At least 2 characters' },
                ]}
              >
                <Input size={screens.xs ? 'large' : 'middle'} placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={screens.xs ? 0 : 16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="city"
                rules={[
                  { required: true, message: 'City is required' },
                  { min: 2, message: 'At least 2 characters' },
                ]}
              >
                <Input size={screens.xs ? 'large' : 'middle'} placeholder="City" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="postalCode"
                rules={[
                  { required: true, message: 'Postal code is required' },
                  { pattern: /^[0-9]+$/, message: 'Numbers only' },
                ]}
              >
                <Input size={screens.xs ? 'large' : 'middle'} placeholder="Postal Code" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            rules={[
              { required: true, message: 'Address is required' },
              { min: 5, message: 'At least 5 characters' },
            ]}
          >
            <Input.TextArea 
              size={screens.xs ? 'large' : 'middle'} 
              placeholder="Shipping Address" 
              rows={3} 
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Phone number is required' },
              { pattern: /^[0-9]{8,15}$/, message: 'Numbers only, 8-15 digits' },
            ]}
          >
            <Input size={screens.xs ? 'large' : 'middle'} placeholder="Phone Number" />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <Space direction="vertical" size={screens.xs ? 16 : 24} style={{ width: '100%' }}>
          <Form.Item
            name="paymentMethod"
            rules={[{ required: true, message: 'Please select a payment method' }]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="card" disabled>Credit/Debit Card</Radio>
                <Radio value="paypal" disabled>PayPal</Radio>
                <Radio value="cod">Cash on Delivery</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Confirm',
      icon: <CheckCircleOutlined />,
      content: (
        <Space direction="vertical" size={screens.xs ? 16 : 24} style={{ width: '100%' }}>
          <Title level={screens.xs ? 5 : 4}>Order Summary</Title>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: screens.xs ? 14 : 16 }}>
                {item.name} x {item.quantity}
              </Text>
              <Text strong style={{ fontSize: screens.xs ? 14 : 16 }}>
                ฿{(item.price * item.quantity).toFixed(2)}
              </Text>
            </div>
          ))}
          <Divider style={{ margin: screens.xs ? '8px 0' : '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>Total:</Text>
            <Title level={screens.xs ? 5 : 4}>฿{calculateTotal().toFixed(2)}</Title>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: screens.xs ? '12px' : '24px' }}>
      {contextHolder}
      <Space direction="vertical" size={screens.xs ? 16 : 24} style={{ width: '100%' }}>
        <Title level={screens.xs ? 3 : 2} style={{ marginBottom: 0 }}>Checkout</Title>

        <Steps 
          current={currentStep}
          size={screens.xs ? 'small' : 'default'}
          responsive={false}
          direction={screens.xs ? 'vertical' : 'horizontal'}
        >
          {steps.map(step => (
            <Step 
              key={step.title} 
              title={screens.xs ? null : step.title} 
              icon={step.icon} 
            />
          ))}
        </Steps>

        <Row gutter={screens.xs ? 0 : 24}>
          <Col xs={24} md={16}>
            <Card bodyStyle={{ padding: screens.xs ? '16px' : '24px' }}>
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {steps[currentStep].content}

                <div style={{ 
                  display: 'flex', 
                  justifyContent: screens.xs ? 'space-between' : 'flex-start',
                  marginTop: screens.xs ? 16 : 24,
                  gap: screens.xs ? 8 : 16
                }}>
                  {currentStep > 0 && (
                    <Button 
                      onClick={handlePrevious}
                      icon={screens.xs ? <LeftOutlined /> : null}
                      size={screens.xs ? 'large' : 'middle'}
                      block={screens.xs}
                    >
                      {screens.xs ? null : 'Previous'}
                    </Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button 
                      type="primary" 
                      onClick={handleNext}
                      icon={screens.xs ? <RightOutlined /> : null}
                      size={screens.xs ? 'large' : 'middle'}
                      block={screens.xs}
                    >
                      {screens.xs ? null : 'Next'}
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      size={screens.xs ? 'large' : 'middle'}
                      block={screens.xs}
                    >
                      Place Order
                    </Button>
                  )}
                </div>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={8} style={{ marginTop: screens.xs ? 16 : 0 }}>
            <Card 
              title={<Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>Order Summary</Text>}
              bodyStyle={{ padding: screens.xs ? '16px' : '24px' }}
            >
              <Space direction="vertical" size={screens.xs ? 8 : 16} style={{ width: '100%' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: screens.xs ? 14 : 16 }}>
                      {item.name} x {item.quantity}
                    </Text>
                    <Text style={{ fontSize: screens.xs ? 14 : 16 }}>
                      ฿{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </div>
                ))}
                <Divider style={{ margin: screens.xs ? '8px 0' : '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: screens.xs ? 14 : 16 }}>Subtotal:</Text>
                  <Text strong style={{ fontSize: screens.xs ? 14 : 16 }}>
                    ฿{calculateTotal().toFixed(2)}
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: screens.xs ? 14 : 16 }}>Shipping:</Text>
                  <Text strong style={{ fontSize: screens.xs ? 14 : 16 }}>Free</Text>
                </div>
                <Divider style={{ margin: screens.xs ? '8px 0' : '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: screens.xs ? 16 : 18 }}>Total:</Text>
                  <Title level={screens.xs ? 5 : 4}>฿{calculateTotal().toFixed(2)}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Checkout;