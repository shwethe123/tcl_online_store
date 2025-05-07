import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Divider, Spin } from 'antd';
import {
  ClockCircleOutlined,
  SmileOutlined,
  CreditCardOutlined,
  AppstoreOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api/api_store';

const { Title, Text } = Typography;
const { Meta } = Card;

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

const TypingTitle = ({ text }) => (
  <motion.h1
    variants={containerVariants}
    initial="hidden"
    animate="show"
    style={{ fontSize: 48, color: '#ffffff', fontWeight: 'bold' }}
  >
    {text.split('').map((char, i) => (
      <motion.span key={i} variants={letterVariants}>
        {char}
      </motion.span>
    ))}
  </motion.h1>
);

const CategoryButtons = ({ categories, onCategorySelect }) => (
  <div style={{ padding: '24px 5%', backgroundColor: '#ffffff' }}>
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', padding: '16px 0' }}>
      {categories.map((cat, index) => (
        <motion.div
          key={index}
          whileHover={{
            y: -4,
            scale: 1.05,
            transition: { duration: 0.3 },
          }}
          style={{ display: 'inline-block', marginRight: 12 }}
        >
          <Button
            type="text"
            style={{
              borderRadius: 20,
              backgroundColor: '#f0f2f5',
              border: '1px solid #dcdcdc',
              padding: '6px 20px',
              color: '#4A90E2',
              fontWeight: 500,
            }}
            icon={index === 0 ? <AppstoreOutlined /> : <ShoppingOutlined />}
            onClick={() => onCategorySelect(cat)} // Set the selected category
          >
            {cat}
          </Button>
        </motion.div>
      ))}
    </div>
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Track the selected category
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchProducts();
        setFeaturedProducts(products);
        setFilteredProducts(products); // Initially show all products

        // Extract unique categories from the fetched products
        const productCategories = Array.from(new Set(products.map((product) => product.category)));
        setCategories(["All", ...productCategories]); // Adding "All" to the start
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter the products based on the selected category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(featuredProducts); // Show all products when "All" is selected
    } else {
      setFilteredProducts(featuredProducts.filter(product => product.category === selectedCategory));
    }
  }, [selectedCategory, featuredProducts]); // Run when selectedCategory or featuredProducts change

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f7f9fc' }}>
      {/* Hero Section */}
      <div style={{
        padding: '60px 5%',
        background: 'linear-gradient(135deg, #4A90E2, #70c1ff)',
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
            <Button size="large" type="default" style={{ color: '#4A90E2' }}>
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
      <CategoryButtons categories={categories} onCategorySelect={setSelectedCategory} />

      {/* Product Grid */}
      <div style={{ padding: '50px 5%', backgroundColor: '#ffffff' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#333' }}>🔥 Hot Picks</Title>
        <Row gutter={[24, 24]} justify="center" style={{ marginTop: 30 }}>
          {(loading ? Array.from({ length: 6 }) : filteredProducts).map((product, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
                cover={
                  <div style={{ position: 'relative', height: 260, width: '100%' }}>
                    {loading || !product?.imageUrls ? (
                      <div
                        style={{
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f0f2f5',
                        }}
                      >
                        <Spin size="large" />
                      </div>
                    ) : (
                      <img
                        alt={product.name}
                        src={product.imageUrls[0]} // Make sure you use the correct field for the image
                        style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                      />
                    )}
                    <Tag color="magenta" style={{ position: 'absolute', top: 12, left: 12 }}>
                      Limited
                    </Tag>
                  </div>
                }
              >
                <Meta
                  title={<Text strong>{product?.name || 'Loading...'}</Text>}
                  description={
                    <>
                      <Text type="danger">
                        {product?.price ? `฿${product.price}` : ''}
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Text strong>Available Sizes:</Text>
                        <div style={{ marginTop: 6 }}>
                          {product?.sizes && product.sizes.length > 0 ? (
                            product.sizes.map((size, index) => (
                              <Tag key={index} style={{ margin: '4px' }} color="blue">
                                {size}
                              </Tag>
                            ))
                          ) : (
                            <Text type="secondary">No sizes available</Text>
                          )}
                        </div>
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Promo Benefits */}
      <Divider />
      <div style={{ padding: '40px 5%', backgroundColor: '#f7f9fc' }}>
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
