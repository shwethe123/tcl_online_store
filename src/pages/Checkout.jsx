import React, { useState, useEffect } from 'react';
import {
  Typography, Form, Input, Button, Space, Card,
  Row, Col, Steps, Radio, Divider, message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardOutlined, HomeOutlined, CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;

const Checkout = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    console.log(savedCart);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
  
      // Ensure each item has an `id`
      const validCart = parsedCart.map((item, index) => ({
        id: item.id || item._id || `item-${index}`, // fallback if missing
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

    console.log('📦 Sending Order to Backend:', orderData);

    try {
      message.loading({ content: 'Processing your order...', key: 'order' });

      const response = await fetch('http://localhost:5000/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      await response.json();

      messageApi.open({
        type: 'success',
        content: 'Order placed successfully!',
        key: 'order',
      });

      localStorage.removeItem('cart');
      navigate('/');
    } catch (error) {
      console.error('Order error:', error);
      messageApi.open({
        type: 'error',
        content: 'Something went wrong while placing the order.',
        key: 'order',
      });
    }
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormValues(prev => ({ ...prev, ...values }));
      form.resetFields(); // optional: clear form for next step
      setCurrentStep(prev => prev + 1);
    } catch (error) {
      // validation failed, do nothing
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
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                rules={[
                  { required: true, message: 'First name is required' },
                  { min: 2, message: 'At least 2 characters' },
                  { max: 50, message: 'No more than 50 characters' },
                ]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                rules={[
                  { required: true, message: 'Last name is required' },
                  { min: 2, message: 'At least 2 characters' },
                  { max: 50, message: 'No more than 50 characters' },
                ]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                rules={[
                  { required: true, message: 'City is required' },
                  { min: 2, message: 'At least 2 characters' },
                  { max: 50, message: 'No more than 50 characters' },
                ]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            rules={[
              { required: true, message: 'Address is required' },
              { min: 5, message: 'At least 5 characters' },
              { max: 200, message: 'No more than 200 characters' },
            ]}
          >
            <Input.TextArea placeholder="Shipping Address" rows={3} />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Phone number is required' },
              { pattern: /^[0-9]{8,15}$/, message: 'Numbers only, 8–15 digits' },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>
        </Space>
      ),
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
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
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Title level={4}>Order Summary</Title>
          {cartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{item.name} x {item.quantity}</Text>
              <Text strong>฿{(item.price * item.quantity).toFixed(2)}</Text>
            </div>
          ))}
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong>Total:</Text>
            <Title level={4}>฿{calculateTotal().toFixed(2)}</Title>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Title level={2}>Checkout</Title>

        <Steps current={currentStep}>
          {steps.map(step => (
            <Step key={step.title} title={step.title} icon={step.icon} />
          ))}
        </Steps>

        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
              >
                {steps[currentStep].content}

                <Space style={{ marginTop: 16 }}>
                  {currentStep > 0 && (
                    <Button onClick={handlePrevious}>Previous</Button>
                  )}
                  {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                  {currentStep === steps.length - 1 && (
                    <Button type="primary" htmlType="submit">
                      Place Order
                    </Button>
                  )}
                </Space>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Order Summary">
              <Space direction="vertical" style={{ width: '100%' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{item.name} x {item.quantity}</Text>
                    <Text>฿{(item.price * item.quantity).toFixed(2)}</Text>
                  </div>
                ))}
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Subtotal:</Text>
                  <Text strong>฿{calculateTotal().toFixed(2)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Shipping:</Text>
                  <Text strong>Free</Text>
                </div>
                <Divider />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Total:</Text>
                  <Title level={4}>฿{calculateTotal().toFixed(2)}</Title>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Space>
    </>
  );
};

export default Checkout;
