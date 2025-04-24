import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Rate,
  Tag,
  Space,
  Button,
  message,
  Image,
  Descriptions,
  Grid,
  Skeleton,
  Divider,
  Tabs,
  List,
  Badge,
  Alert
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { fetchProducts } from '../api/api_store';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const screens = useBreakpoint();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const fetchProductDetails = async () => {
      try {
        const products = await fetchProducts();
        const foundProduct = products.find(p => p._id === id);
        setProduct(foundProduct);
      } catch (error) {
        message.error('Failed to fetch product details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const existingItem = cart.find(item => item._id === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === product._id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
    message.success('Added to cart successfully!');
  };

  const toggleWishlist = () => {
    if (!product) return;

    const newWishlist = wishlist.includes(product._id)
      ? wishlist.filter(id => id !== product._id)
      : [...wishlist, product._id];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    message.success(
      wishlist.includes(product._id)
        ? 'Removed from wishlist'
        : 'Added to wishlist'
    );
  };

  // Safe feature extraction
  const getFeatures = () => {
    if (!product?.features) return [];
    
    try {
      if (Array.isArray(product.features)) {
        return product.features.filter(item => item != null);
      }
      
      if (typeof product.features === 'string') {
        return product.features
          .split(',')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
      
      return [String(product.features)];
    } catch (error) {
      console.error('Error processing features:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div style={{ padding: screens.xs ? '12px' : '24px' }}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Skeleton.Image active style={{ width: '100%', height: screens.xs ? '200px' : '400px' }} />
            </Col>
            <Col xs={24} md={12}>
              <Skeleton active paragraph={{ rows: 6 }} />
            </Col>
          </Row>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: screens.xs ? '12px' : '24px' }}>
        <Card>
          <Empty description="Product not found" />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: screens.xs ? '12px' : '24px' }}>
      <Card bordered={false} bodyStyle={{ padding: screens.xs ? 8 : 16 }}>
        <Row gutter={[16, 16]}>
          {/* Product Image */}
          <Col xs={24} md={12}>
            <Badge.Ribbon 
              text={product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock'} 
              color={product.stock <= 5 ? 'red' : 'green'}
            >
              <Image
                src={product.imageUrls}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: screens.xs ? 'auto' : '400px',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
                preview={true}
              />
            </Badge.Ribbon>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <Space direction="vertical" size={screens.xs ? 12 : 16} style={{ width: '100%' }}>
              <Title level={screens.xs ? 4 : 2} style={{ marginBottom: 0 }}>
                {product.name}
              </Title>
              
              <Space size={8}>
                <Tag color="blue" style={{ fontSize: screens.xs ? 12 : 14 }}>
                  {product.category}
                </Tag>
                <Rate 
                  disabled 
                  defaultValue={product.rating} 
                  style={{ fontSize: screens.xs ? 14 : 16 }} 
                />
                <Text>({product.reviews || 0} reviews)</Text>
              </Space>

              <Title level={3} style={{ marginTop: screens.xs ? 0 : 8 }}>
                ฿{product.price.toLocaleString()}
              </Title>

              {product.discount && (
                <Alert 
                  message={`${product.discount}% OFF`} 
                  type="success" 
                  showIcon 
                  style={{ width: 'fit-content' }}
                />
              )}

              <Divider style={{ margin: screens.xs ? '8px 0' : '16px 0' }} />

              {/* Action Buttons */}
              <Space
                size={screens.xs ? 8 : 16}
                direction={screens.xs ? 'vertical' : 'horizontal'}
                style={{ width: '100%' }}
              >
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  size={screens.xs ? 'middle' : 'large'}
                  block={screens.xs}
                >
                  {screens.xs ? 'Add to Cart' : 'Add to Cart'}
                </Button>
                <Button
                  icon={
                    wishlist.includes(product._id) ? (
                      <HeartFilled style={{ color: '#ff4d4f' }} />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={toggleWishlist}
                  size={screens.xs ? 'middle' : 'large'}
                  block={screens.xs}
                >
                  {wishlist.includes(product._id)
                    ? (screens.xs ? 'Saved' : 'Remove from Wishlist')
                    : (screens.xs ? 'Save' : 'Add to Wishlist')}
                </Button>
              </Space>

              {/* Product Highlights */}
              {getFeatures().length > 0 && (
                <div style={{ marginTop: screens.xs ? 8 : 16 }}>
                  <Text strong>Highlights:</Text>
                  <List
                    size="small"
                    dataSource={getFeatures()}
                    renderItem={item => (
                      <List.Item style={{ paddingLeft: 0 }}>
                        <Text style={{ fontSize: screens.xs ? 13 : 14 }}>• {item}</Text>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Space>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginTop: screens.xs ? 16 : 24 }}
          tabPosition={screens.xs ? 'top' : 'left'}
          size={screens.xs ? 'small' : 'default'}
        >
          <TabPane tab="Details" key="details">
            <Descriptions 
              bordered 
              column={screens.xs ? 1 : 2}
              size={screens.xs ? 'small' : 'default'}
            >
              {product.specs && Object.entries(product.specs).map(([key, value]) => (
                <Descriptions.Item label={key} key={key}>
                  {value}
                </Descriptions.Item>
              ))}
              <Descriptions.Item label="Description" span={screens.xs ? 1 : 2}>
                {product.description || 'No description available'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          
          <TabPane tab="Shipping" key="shipping">
            <Space direction="vertical" size={screens.xs ? 8 : 16}>
              <Text strong>Delivery Options:</Text>
              <List
                size="small"
                dataSource={[
                  'Standard Delivery: 3-5 business days',
                  'Express Delivery: 1-2 business days',
                  'Free pickup available at our stores'
                ]}
                renderItem={item => (
                  <List.Item style={{ paddingLeft: 0 }}>
                    <Text style={{ fontSize: screens.xs ? 13 : 14 }}>• {item}</Text>
                  </List.Item>
                )}
              />
              
              <Text strong>Return Policy:</Text>
              <Text style={{ fontSize: screens.xs ? 13 : 14 }}>
                Easy 30-day return policy. Items must be unused with original packaging.
              </Text>
            </Space>
          </TabPane>
          
          <TabPane tab="Reviews" key="reviews">
            <Space direction="vertical" size={screens.xs ? 8 : 16} style={{ width: '100%' }}>
              <Rate disabled defaultValue={product.rating} />
              <Text>{product.reviews || 0} customer reviews</Text>
              
              {[1, 2, 3, 4, 5].map(star => (
                <div key={star} style={{ display: 'flex', alignItems: 'center' }}>
                  <Text style={{ width: 80 }}>{star} star{star !== 1 ? 's' : ''}</Text>
                  <div style={{ flex: 1, margin: '0 8px' }}>
                    <div style={{
                      height: 8,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 4,
                      width: '100%'
                    }}>
                      <div style={{
                        height: '100%',
                        backgroundColor: '#faad14',
                        borderRadius: 4,
                        width: `${(product.rating / 5) * 100}%`
                      }} />
                    </div>
                  </div>
                  <Text type="secondary">{(product.rating / 5 * 100).toFixed(0)}%</Text>
                </div>
              ))}
            </Space>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductDetails;