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
  Skeleton,
  Drawer,
  Grid
} from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, FilterOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/api_store';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;
const { useBreakpoint } = Grid;

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
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const screens = useBreakpoint();

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
    message.success('Added to cart');
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

  const filterCard = (
    <Card title="Filters" style={{ height: '100%' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text strong>Price Range</Text>
        <Slider
          range
          min={0}
          max={maxPrice}
          value={priceRange}
          onChange={setPriceRange}
          tooltip={{ formatter: value => `฿${value}` }}
        />
        <Space style={{ marginTop: 8 }}>
          <Text>฿{priceRange[0]}</Text>
          <Text>-</Text>
          <Text>฿{priceRange[1]}</Text>
        </Space>

        <Text strong style={{ marginTop: 16 }}>Category</Text>
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: '100%' }}
          options={categories.map(category => ({
            value: category,
            label: category.charAt(0).toUpperCase() + category.slice(1)
          }))}
        />

        <Text strong style={{ marginTop: 16 }}>Sort By</Text>
        <Select
          placeholder="Sort by"
          style={{ width: '100%' }}
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
    </Card>
  );

  return (
    <motion.div
      className="products-container"
      style={{ background: '#e0e5ec', padding: screens.xs ? '12px' : '24px' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Title level={2} style={{ margin: 0, fontSize: screens.xs ? '20px' : '24px' }}>
              Our Products {!loading && `(${filteredAndSortedProducts.length})`}
            </Title>
          </Col>
          <Col xs={24} md={16}>
            <Space wrap style={{ width: screens.xs ? '100%' : 'auto' }}>
              <Search
                placeholder="Search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: screens.xs ? '100%' : 200 }}
                allowClear
                size={screens.xs ? 'large' : 'middle'}
              />
              {screens.md ? (
                <>
                  <Select
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    style={{ width: 150 }}
                    options={categories.map(category => ({
                      value: category,
                      label: category.charAt(0).toUpperCase() + category.slice(1)
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
                </>
              ) : (
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setFilterDrawerVisible(true)}
                  size="large"
                >
                  Filters
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {screens.md && (
            <Col xs={0} md={6}>
              {filterCard}
            </Col>
          )}

          <Col xs={24} md={18}>
            {loading ? (
              <Row gutter={[16, 16]}>
                {[...Array(screens.xs ? 4 : 8)].map((_, i) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={i}>
                    <Card><Skeleton active /></Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Row gutter={[16, 16]}>
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map(product => (
                    <Col xs={24} sm={12} md={8} lg={6} xl={6} key={product._id}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <Badge.Ribbon
                          text={product.price > 500 ? 'Premium' : product.price > 200 ? 'Standard' : 'Best Deal'}
                          color={product.price > 500 ? 'black' : product.price > 200 ? 'orange' : 'green'}
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
                                    height: screens.xs ? '120px' : '180px',
                                    objectFit: 'cover',
                                    borderRadius: 10
                                  }}
                                />
                              </Link>
                            }
                            actions={[
                              <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => handleAddToCart(product)}
                              >
                                {screens.xs ? 'Add' : 'Add to Cart'}
                              </Button>,
                              wishlist.includes(product._id)
                                ? <HeartFilled onClick={() => toggleWishlist(product._id)} />
                                : <HeartOutlined onClick={() => toggleWishlist(product._id)} />
                            ]}
                          >
                            <Meta
                              title={<Link to={`/product/${product._id}`}>{product.name}</Link>}
                              description={
                                <Space direction="vertical" size={2}>
                                  <Tag color="blue">{product.category}</Tag>
                                  <Rate disabled defaultValue={product.rating} />
                                  <Text strong>฿{product.price}</Text>
                                </Space>
                              }
                            />
                          </Card>
                        </Badge.Ribbon>
                      </motion.div>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Card><Empty description="No products found matching your criteria" /></Card>
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

      <Drawer
        title="Filters"
        placement="right"
        onClose={() => setFilterDrawerVisible(false)}
        open={filterDrawerVisible}
        width={300}
        closable
      >
        {filterCard}
      </Drawer>
    </motion.div>
  );
};

export default Products;
