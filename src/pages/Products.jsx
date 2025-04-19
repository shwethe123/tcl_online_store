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
import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/api_store';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
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
        message.error('Failed to fetch products: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];
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
    message.success('Added to cart successfully!');
  };
  
  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
  
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    message.success(
      wishlist.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist'
    );
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()); // FIXED
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
              Our Products {!loading && `(${filteredAndSortedProducts.length})`}
            </Title>
          </Col>
          <Col xs={24} md={16}>
            <Space wrap>
              <Search
                placeholder="Search products..."
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
                placeholder="Sort by"
                style={{ width: 150 }}
                onChange={setSortBy}
                value={sortBy}
                options={[
                  { value: 'default', label: 'Default' },
                  { value: 'price-asc', label: 'Price: Low to High' },
                  { value: 'price-desc', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Top Rated' }
                ]}
              />
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <Card title="Filters">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>Price Range</Text>
                <Slider
                  range
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onChange={setPriceRange}
                  tooltip={{ formatter: value => `$${value}` }} // FIXED
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
                  <Col xs={24} sm={12} lg={8} key={i}>
                    <Card>
                      <Skeleton active />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row gutter={[24, 24]}>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <Col xs={24} sm={12} lg={8} key={product._id}>
                      <Badge.Ribbon
                        text={
                          product.price > 500 ? 'Premium' :
                          product.price > 200 ? 'Standard' :
                          'Best Deal'
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
                                style={{ height: 200, objectFit: 'cover' }}
                              />
                            </Link>
                          }
                          actions={[
                            <Button
                              type="primary"
                              icon={<ShoppingCartOutlined />}
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to Cart
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
                            title={<Link to={`/product/${product._id}`}>{product.name}</Link>}
                            description={
                              <Space direction="vertical" size={2}>
                                <Tag color="blue">{product.category}</Tag>
                                <Rate disabled defaultValue={product.rating} style={{ fontSize: 14 }} />
                                <Text strong style={{ fontSize: 16 }}>฿{product.price}</Text>
                                {product.stock <= 5 && (
                                  <Text type="danger">Only {product.stock} left!</Text>
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
                    <Card>
                      <Empty description="No products found matching your criteria" />
                    </Card>
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
