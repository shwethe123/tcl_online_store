import React from 'react';
import { Typography, Card, Row, Col, Button, Tag, Divider } from 'antd';
import {
  ClockCircleOutlined,
  SmileOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Meta } = Card;

// Typing animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const featuredProducts = [
  {
    title: "Bass Boost Earbuds",
    price: "฿219.00",
    image: "https://shorturl.at/1tLe7"
  },
  {
    title: "Smart Fitness Band",
    price: "฿499.00",
    image: "https://shorturl.at/1sXVp"
  },
  {
    title: "Stylish Hoodie",
    price: "฿699.00",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246"
  }
];

const categories = ["All", "Gadgets", "Fashion", "Lifestyle", "Home", "Sale"];

const TypingTitle = ({ text }) => (
  <motion.h1
    variants={containerVariants}
    initial="hidden"
    animate="show"
    style={{ fontSize: 50, color: '#fff', fontWeight: 'bold' }}
  >
    {text.split('').map((char, i) => (
      <motion.span key={i} variants={letterVariants}>
        {char}
      </motion.span>
    ))}
  </motion.h1>
);

const CategoryButtons = () => {
  return (
    <div style={{ padding: '20px 5%' }}>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '20px' }}>
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{
              y: -5,            // Moves the button upwards on hover
              scale: 1.05,       // Slightly increases the size
              rotate: 2,         // Adds a small rotation for dynamic effect
              transition: { duration: 0.3 },
            }}
            style={{ display: 'inline-block', marginRight: 16 }}
          >
            <Button
              type="text"
              style={{
                borderRadius: 20,
                backgroundColor: '#fafafa',
                border: '1px solid #ddd',
                padding: '6px 18px',
              }}
              icon={index === 0 ? <AppstoreOutlined /> : <ShoppingOutlined />}
            >
              {cat}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#fff' }}>
      {/* Hero Section */}
      <div style={{
        padding: '60px 5%',
        background: 'linear-gradient(135deg, #ff6f61, #ffcc70)',
        color: '#fff',
        borderBottomRightRadius: 60,
      }}>
        <Row align="middle">
          <Col xs={24} md={14}>
            <TypingTitle text="🔥 Summer Flash Deals" />
            <Text style={{ fontSize: 20, color: '#fff' }}>
              Up to 50% off on headphones, wearables & streetwear.
            </Text>
            <br /><br />
            <Button size="large" type="default" style={{ color: '#ff4d4f' }}>
              Shop Flash Sale
            </Button>
          </Col>
          <Col xs={24} md={10}>
            <img
              src="https://shorturl.at/aarvx"
              alt="Flash Deal"
              style={{ width: '100%', borderRadius: 16 }}
            />
          </Col>
        </Row>
      </div>

      {/* Category Navigation */}
      <CategoryButtons />

      {/* Product Grid */}
      <div style={{ padding: '40px 5%' }}>
        <Title level={2} style={{ textAlign: 'center' }}>Hot Picks</Title>
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
          {featuredProducts.map((product, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{ borderRadius: 16, overflow: 'hidden' }}
                cover={
                  <div style={{ position: 'relative' }}>
                    <img
                      alt={product.title}
                      src={product.image}
                      style={{ height: 260, width: '100%', objectFit: 'cover' }}
                    />
                    <Tag
                      color="magenta"
                      style={{ position: 'absolute', top: 12, left: 12 }}
                    >
                      Limited
                    </Tag>
                  </div>
                }
              >
                <Meta
                  title={<Text strong>{product.title}</Text>}
                  description={<Text type="danger">{product.price}</Text>}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Promo Benefits */}
      <Divider />
      <div style={{ padding: '40px 5%' }}>
        <Row gutter={[24, 24]} justify="center">
          {[{
            icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#faad14' }} />,
            title: "Fast Delivery",
            desc: "Across all 77 provinces"
          }, {
            icon: <SmileOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
            title: "Friendly Support",
            desc: "Live chat 9am-6pm"
          }, {
            icon: <CreditCardOutlined style={{ fontSize: 28, color: '#1890ff' }} />,
            title: "Secure Payment",
            desc: "All major banks & wallets"
          }].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center' }}
            >
              {item.icon}
              <Title level={5} style={{ marginTop: 10 }}>{item.title}</Title>
              <Text type="secondary">{item.desc}</Text>
            </motion.div>
          ))}
        </Row>
      </div>

      {/* Final CTA with Marquee */}
      <div style={{
        backgroundColor: '#ff4d4f',
        padding: '80px 5% 60px',
        color: '#fff',
        textAlign: 'center',
        borderTopLeftRadius: 60,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Marquee */}
        <div style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: '#d9363e'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '10px 0',
            animation: 'marquee 12s linear infinite',
            fontWeight: 'bold'
          }}>
            🎉 Hot Deal → Free Shipping + ฿100 Coupon → Flash Sale Up to 70%!
          </div>
        </div>

        <Title level={3} style={{ color: '#fff', marginTop: 60 }}>
          🎁 Join & Get ฿100 Coupon
        </Title>
        <Text style={{ color: '#fff' }}>
          Sign up to unlock weekly hot deals & member-only prices.
        </Text>
        <br /><br />
        <Button type="default" size="large" style={{ color: '#ff4d4f' }}>
          Register Now
        </Button>
      </div>

      {/* CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default Home;
