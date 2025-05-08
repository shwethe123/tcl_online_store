import React, { useEffect, useState } from 'react';
import {
  Typography, Card, Row, Col, Button, Spin, Input
} from 'antd';
import { fetchProducts } from '../api/api_store';
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Meta } = Card;

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = t => {
    const h = String(Math.floor(t / 3600)).padStart(2, '0');
    const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={{
      background: '#ffe58f',
      textAlign: 'center',
      padding: '20px 0',
      marginBottom: 30
    }}>
      <Title level={4}>⚡ Flash Sale! Ends in {format(timeLeft)}</Title>
      <Text>Don't miss your chance to save big!</Text>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const isMobile = window.innerWidth < 576;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res);
        const uniqueCats = Array.from(new Set(res.map(p => p.category)));
        setCategories(['All', ...uniqueCats]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = products.filter(p =>
    (category === 'All' || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#e0e5ec', minHeight: '100vh', fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <div style={{
        padding: isMobile ? '60px 5%' : '100px 5%',
        background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(../src/assets/cover.jpg) center/cover no-repeat',
        borderBottomRightRadius: 80,
        textAlign: 'center',
        color: '#fff',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            display: 'inline-block',
            padding: isMobile ? 30 : 40,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 20,
            backdropFilter: 'blur(8px)'
          }}
        >
          <Title level={2} style={{ fontSize: isMobile ? 24 : 36 }}>🛍️ Unlock Your Style</Title>
          <Text style={{ fontSize: isMobile ? 14 : 18 }}>Premium streetwear and lifestyle essentials</Text>
          <br /><br />
          <Button
            type="primary"
            size={isMobile ? 'middle' : 'large'}
            style={{ background: '#ff4d4f', border: 'none' }}
          >
            Start Exploring
          </Button>
        </motion.div>
      </div>

      <FlashSale />

      {/* Search & Categories */}
      <div style={{ padding: '30px 5%' }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Input
              size={isMobile ? 'middle' : 'large'}
              prefix={<SearchOutlined />}
              placeholder="Search products..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12}>
            <div style={{
              overflowX: isMobile ? 'auto' : 'visible',
              whiteSpace: isMobile ? 'nowrap' : 'normal',
              paddingTop: isMobile ? 10 : 0,
              paddingBottom: isMobile ? 8 : 0
            }}>
              <Row gutter={8} justify={isMobile ? 'start' : 'end'} wrap={!isMobile}>
                {categories.map((cat, idx) => (
                  <Col key={idx}>
                    <Button
                      type={category === cat ? 'primary' : 'default'}
                      onClick={() => setCategory(cat)}
                      shape="round"
                      icon={<AppstoreOutlined />}
                      size={isMobile ? 'small' : 'middle'}
                      style={{ marginBottom: isMobile ? 6 : 0 }}
                    >
                      {cat}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      {/* Featured Picks */}
      <div style={{ padding: '30px 5%' }}>
        <Title level={4}>🔥 Featured Picks</Title>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 16,
          paddingTop: 10,
          scrollbarWidth: 'none'
        }}>
          {products.slice(0, 5).map((product, i) => (
            <Card
              key={i}
              hoverable
              style={{ minWidth: 200, borderRadius: 10 }}
              cover={<img alt={product.name} src={product.imageUrls?.[0]} style={{ height: 180, objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />}
            >
              <Meta
                title={<Text strong>{product.name}</Text>}
                description={<Text type="danger">฿{product.price}</Text>}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div style={{ padding: isMobile ? '10px 3%' : '20px 5%' }}>
        <Row gutter={[isMobile ? 8 : 16, isMobile ? 12 : 24]}>
          {(loading ? Array(4).fill({}) : filtered).map((product, i) => (
            <Col key={i} xs={12} sm={12} md={6}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card
                  loading={loading}
                  cover={
                    <div style={{
                      height: isMobile ? 140 : 220,
                      background: '#f0f2f5',
                      borderRadius: 10
                    }}>
                      {product?.imageUrls ? (
                        <img
                          alt={product.name}
                          src={product.imageUrls[0]}
                          style={{
                            height: '100%',
                            width: '100%',
                            objectFit: 'cover',
                            borderRadius: 10
                          }}
                        />
                      ) : (
                        <Spin size="large" style={{ display: 'block', margin: 'auto', paddingTop: 40 }} />
                      )}
                    </div>
                  }
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    fontSize: isMobile ? 10 : 14
                  }}
                  bodyStyle={{ padding: isMobile ? '10px' : '16px' }}
                >
                  <Meta
                    title={<Text strong style={{ fontSize: isMobile ? 14 : 16 }}>{product?.name || 'Loading...'}</Text>}
                    description={
                      <>
                        <Text type="danger" style={{ fontSize: isMobile ? 14 : 16 }}>
                          ฿{product?.price}
                        </Text><br />
                        <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                          Sizes: {product?.sizes?.join(', ') || 'N/A'}
                        </Text>
                      </>
                    }
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Customer Reviews */}
      <div style={{ padding: '40px 5%', background: '#fafafa' }}>
        <Title level={4} style={{ textAlign: 'center' }}>💬 What Our Customers Say</Title>
        <Row gutter={[16, 16]} justify="center">
          {[1, 2, 3].map((_, i) => (
            <Col key={i} xs={24} sm={12} md={8}>
              <Card bordered={false} style={{ borderRadius: 12 }}>
                <Text>"Outstanding quality and fast delivery! Will definitely shop again."</Text>
                <br />
                <Text type="secondary">– Thiri, Yangon</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Instagram Gallery */}
      <div style={{ padding: '40px 5%', backgroundColor: '#fff' }}>
        <Title level={4}>📸 Follow Us on Instagram</Title>
        <Row gutter={[8, 8]}>
          {[...Array(6)].map((_, idx) => (
            <Col xs={8} sm={4} key={idx}>
              <img
                src={`https://shorturl.at/Bp0wt?sig=${idx}`}
                alt="insta"
                style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
              />
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Footer */}
      <div style={{
        marginTop: 50,
        backgroundColor: '#001529',
        color: '#fff',
        padding: isMobile ? '40px 5%' : '60px 5%',
        textAlign: 'center',
        borderTopLeftRadius: 80
      }}>
        <Title level={3} style={{ color: '#fff', fontSize: isMobile ? 20 : 28 }}>🎁 Don’t Miss Out</Title>
        <Text style={{ fontSize: isMobile ? 14 : 16 }}>Sign up and get ฿100 discount + free shipping!</Text>
        <br /><br />
        <Button type="primary" size={isMobile ? 'middle' : 'large'}>Join Now</Button>
      </div>
    </div>
  );
};

export default Home;
