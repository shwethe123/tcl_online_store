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
  Grid
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { fetchProducts } from '../api/api_store';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const screens = useBreakpoint(); // detect screen size

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Image
              src={product.imageUrls}
              alt={product.name}
              style={{ width: '100%', objectFit: 'cover' }}
            />
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Title level={2}>{product.name}</Title>
              <Tag color="blue">{product.category}</Tag>
              <Rate disabled defaultValue={product.rating} />
              <Title level={3}>฿{product.price}</Title>

              {product.stock <= 5 && (
                <Text type="danger">Only {product.stock} left!</Text>
              )}

              {/* 👇 Responsive Buttons */}
              <Space
                size={16}
                direction={screens.xs ? 'vertical' : 'horizontal'}
                style={{ width: '100%' }}
              >
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  size="large"
                  block={screens.xs}
                >
                  Add to Cart
                </Button>
                <Button
                  icon={
                    wishlist.includes(product._id) ? (
                      <HeartFilled />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={toggleWishlist}
                  size="large"
                  block={screens.xs}
                >
                  {wishlist.includes(product._id)
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'}
                </Button>
              </Space>

              <Descriptions title="Product Details" bordered>
                <Descriptions.Item label="Category" span={3}>
                  {product.category}
                </Descriptions.Item>
                <Descriptions.Item label="Stock" span={3}>
                  {product.stock}
                </Descriptions.Item>
                <Descriptions.Item label="Rating" span={3}>
                  {product.rating} / 5
                </Descriptions.Item>
                <Descriptions.Item label="Reviews" span={3}>
                  {product.reviews}
                </Descriptions.Item>
                <Descriptions.Item label="Features" span={3}>
                  {product.features}
                </Descriptions.Item>
                <Descriptions.Item label="Specs" span={3}>
                  <ul>
                    {Object.entries(product.specs || {}).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={3}>
                  {product.description}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetails;
