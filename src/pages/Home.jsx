import React from 'react';
import { Typography, Card, Row, Col, Carousel, Button, Space, Divider, Badge } from 'antd';
import { RightOutlined, FireOutlined, GiftOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Meta } = Card;

const Home = () => {
  const carouselItems = [
    {
      title: "Salai Chai Naing Store Summer Collection 2024",
      subtitle: "Up to 50% Off on Selected Items",
      image: "https://images.unsplash.com/photo-1441986300917-64674b  d600d8",
      buttonText: "Shop Now"
    },
    {
      title: "New Tech Arrivals",
      subtitle: "Latest Gadgets and Accessories",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661",
      buttonText: "Explore"
    },
    {
      title: "Home & Living",
      subtitle: "Transform Your Space",
      image: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103",
      buttonText: "Discover More"
    }
  ];

  const featuredProducts = [
    {
      title: "Premium Headphones",
      price: "$199.99",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      tag: "Best Seller"
    },
    {
      title: "Smart Watch",
      price: "$299.99",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      tag: "New"
    },
    {
      title: "Wireless Speaker",
      price: "$159.99",
      image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc",
      tag: "Hot"
    }
  ];

  return (
    <Space direction="vertical" size={48} style={{ width: '100%' }}>
      <Carousel autoplay effect="fade">
        {carouselItems.map((item, index) => (
          <div key={index}>
            <div style={{
              height: '600px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '16px',
            }}>
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10%',
              }}>
                <Space direction="vertical" size={24}>
                  <Title level={1} style={{ color: '#fff', margin: 0, fontSize: '48px' }}>
                    {item.title}
                  </Title>
                  <Text style={{ color: '#fff', fontSize: '24px' }}>
                    {item.subtitle}
                  </Text>
                  <Button type="primary" size="large" ghost style={{ marginTop: 16 }}>
                    {item.buttonText}
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <div>
        <Space align="center" style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Featured Products</Title>
          <Link to="/products">
            <Button type="link" icon={<RightOutlined />}>View All</Button>
          </Link>
        </Space>
        <Row gutter={[24, 24]}>
          {featuredProducts.map((product, index) => (
            <Col xs={24} sm={8} key={index}>
              <Badge.Ribbon text={product.tag} color="black">
                <Card
                  hoverable
                  cover={
                    <div style={{ height: 300, overflow: 'hidden' }}>
                      <img
                        alt={product.title}
                        src={product.image}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  }
                >
                  <Meta
                    title={<Text strong>{product.title}</Text>}
                    description={<Text type="secondary">{product.price}</Text>}
                  />
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card style={{ background: '#f8f8f8', border: 'none' }}>
            <Row gutter={[48, 24]} align="middle">
              <Col xs={24} md={8}>
                <Space align="center">
                  <FireOutlined style={{ fontSize: 36 }} />
                  <div>
                    <Text strong style={{ fontSize: 18 }}>Free Shipping</Text>
                    <br />
                    <Text type="secondary">On orders over $100</Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space align="center">
                  <GiftOutlined style={{ fontSize: 36 }} />
                  <div>
                    <Text strong style={{ fontSize: 18 }}>Special Offers</Text>
                    <br />
                    <Text type="secondary">Save up to 50%</Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space align="center">
                  <ThunderboltOutlined style={{ fontSize: 36 }} />
                  <div>
                    <Text strong style={{ fontSize: 18 }}>Support 24/7</Text>
                    <br />
                    <Text type="secondary">Shop with confidence</Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Home;