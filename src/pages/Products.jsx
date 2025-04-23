import React, { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Row,
  Col,
  Rate,
  Tag,
  Space,
  Button,
  Select,
  message,
  Input,
  Slider,
  Badge,
  Pagination,
  Empty,
  Skeleton
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/api_store';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 12;

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const fetchProductsData = async () => {
      setLoading(true);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        message.error('failed to fetch products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const categories = ['all', ...new Set(products.map(product => product.category?.toLowerCase()))];
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.price)) : 10000;

  const handleAddToCart = (product) => {
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
    message.success('added to cart');
  };

  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    message.success(
      wishlist.includes(productId) ? 'removed from wishlist' : 'added to wishlist'
    );
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category?.toLowerCase() === selectedCategory;
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="products-container" style={{ padding: '24px' }}>
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <Title level={2} style={{ margin: 0 }}>
              our products {!loading && `(${filteredAndSortedProducts.length})`}
            </Title>
          </Col>
          <Col xs={24} md={16}>
            <Space wrap>
              <Search
                placeholder="search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
                allowClear
              />
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: 150 }}
                options={categories.map(category => ({
                  value: category,
                  label: category
                }))}
              />
              <Select
                placeholder="sort by"
                style={{ width: 150 }}
                onChange={setSortBy}
                value={sortBy}
                options={[
                  { value: 'default', label: 'default' },
                  { value: 'price-asc', label: 'price: low to high' },
                  { value: 'price-desc', label: 'price: high to low' },
                  { value: 'rating', label: 'top rated' }
                ]}
              />
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <Card title="filters">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>price range</Text>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={setPriceRange}
                  tooltip={{ formatter: value => `$${value}` }}
                />
                <Space style={{ marginTop: 8 }}>
                  <Text>฿{priceRange[0]}</Text>
                  <Text>-</Text>
                  <Text>฿{priceRange[1]}</Text>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={18}>
            {loading ? (
              <Row gutter={[24, 24]}>
                {[...Array(6)].map((_, i) => (
                  <Col xs={12} sm={12} lg={8} key={i}>
                    <Card><Skeleton active /></Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row gutter={[24, 24]}>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <Col xs={12} sm={12} lg={8} key={product._id}>
                      <Badge.Ribbon
                        text={
                          product.price > 500 ? 'premium' :
                          product.price > 200 ? 'standard' :
                          'best deal'
                        }
                        color={
                          product.price > 500 ? 'black' :
                          product.price > 200 ? 'orange' :
                          'green'
                        }
                      >
                        <Card
                          hoverable
                          cover={
                            <Link to={`/product/${product._id}`}>
                              <img
                                alt={product.name}
                                src={product.imageUrls}
                                style={{
                                  width: '100%',
                                  maxHeight: 180,
                                  objectFit: 'cover'
                                }}
                              />
                            </Link>
                          }
                          actions={[
                            <Button
                              type="primary"
                              icon={<ShoppingCartOutlined />}
                              onClick={() => handleAddToCart(product)}
                              style={{ fontSize: '12px', height: '30px', padding: '0 8px' }}
                            >
                              add to cart
                            </Button>,
                            wishlist.includes(product._id)
                              ? <HeartFilled
                                  onClick={() => toggleWishlist(product._id)}
                                  style={{ color: '#ff4d4f', fontSize: '16px' }}
                                />
                              : <HeartOutlined
                                  onClick={() => toggleWishlist(product._id)}
                                  style={{ fontSize: '16px' }}
                                />
                          ]}
                        >
                          <Meta
                            title={
                              <Link to={`/product/${product._id}`} style={{ fontSize: '13px', fontWeight: 500 }}>
                                {product.name?.toLowerCase()}
                              </Link>
                            }
                            description={
                              <Space direction="vertical" size={2}>
                                <Tag color="blue" style={{ fontSize: '11px' }}>{product.category?.toLowerCase()}</Tag>
                                <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                                <Text strong style={{ fontSize: '13px' }}>฿{product.price}</Text>
                                {product.stock <= 5 && (
                                  <Text type="danger" style={{ fontSize: '12px' }}>
                                    only {product.stock} left!
                                  </Text>
                                )}
                              </Space>
                            }
                          />
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Card><Empty description="no products found matching your criteria" /></Card>
                  </Col>
                )}
              </Row>
            )}
          </Col>
        </Row>

        {filteredAndSortedProducts.length > 0 && (
          <Row justify="center" style={{ marginTop: 24 }}>
            <Pagination
              current={currentPage}
              total={filteredAndSortedProducts.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </Row>
        )}
      </Space>
    </div>
  );
};

export default Products;
