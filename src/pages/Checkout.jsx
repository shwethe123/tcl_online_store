import React, { useState, useEffect } from 'react';
import { Typography, Form, Input, Button, Space, Card, Row, Col, Steps, Radio, Divider, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CreditCardOutlined, HomeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = (values) => {
    // Simulate order processing
    message.loading('Processing your order...', 2)
      .then(() => {
        localStorage.removeItem('cart');
        message.success('Order placed successfully!');
        navigate('/');
      });
  };

  const steps = [
    {
      title: 'Shipping',
      icon: <HomeOutlined />,
      content: (
        <Form.Item>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Input.Group size="large">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="firstName" rules={[{ required: true, message: 'First name required' }]}>
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" rules={[{ required: true, message: 'Last name required' }]}>
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>
            </Input.Group>
            <Form.Item name="address" rules={[{ required: true, message: 'Address required' }]}>
              <Input.TextArea placeholder="Shipping Address" rows={3} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="city" rules={[{ required: true, message: 'City required' }]}>
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="zipCode" rules={[{ required: true, message: 'ZIP code required' }]}>
                  <Input placeholder="ZIP Code" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="phone" rules={[{ required: true, message: 'Phone required' }]}>
              <Input placeholder="Phone Number" />
            </Form.Item>
          </Space>
        </Form.Item>
      ),
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
      content: (
        <Form.Item>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Form.Item name="paymentMethod" rules={[{ required: true, message: 'Select payment method' }]}>
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="card">Credit/Debit Card</Radio>
                  <Radio value="paypal">PayPal</Radio>
                  <Radio value="cod">Cash on Delivery</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="cardNumber" rules={[{ required: true, message: 'Card number required' }]}>
              <Input placeholder="Card Number" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="expiry" rules={[{ required: true, message: 'Expiry date required' }]}>
                  <Input placeholder="MM/YY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="cvv" rules={[{ required: true, message: 'CVV required' }]}>
                  <Input placeholder="CVV" />
                </Form.Item>
              </Col>
            </Row>
          </Space>
        </Form.Item>
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
    <Space direction="vertical" size={24} style={{ width: '100%' }}>
      <Title level={2}>Checkout</Title>

      <Steps current={currentStep}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
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

              <Space>
                {currentStep > 0 && (
                  <Button onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
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
  );
};

export default Checkout;