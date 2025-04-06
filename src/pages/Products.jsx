import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Rate, Tag, Space, Button, Select, message, Input, Slider, Badge, Pagination } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api/api_store'; // import the API function

const { Title, Text } = Typography;
const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]); // Store the products fetched from the API

  const pageSize = 12;

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    const dataFetch = async () => {
      try {
        const productsData = await fetchProducts(); // Fetch products from the API
        setProducts(productsData);
      } catch (error) {
        message.error('Failed to fetch products');
      }
    };

    dataFetch();
  }, []);

  const categories = ['All', ...new Set(products.map(product => product.category))];

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
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
    message.success(wishlist.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const filteredAndSortedProducts = products
    .filter(product =>
      (selectedCategory === 'All' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )
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
    <div className="products-container">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={8}>
            <Title level={2} style={{ margin: 0 }}>Our Products</Title>
          </Col>
          <Col xs={24} md={16}>
            <Space wrap>
              <Search
                placeholder="Search products..."
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
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
                  { value: 'rating', label: 'Rating' }
                ]}
              />
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={6}>
            <Card title="Price Range">
              <Slider
                range
                min={0}
                max={500}
                value={priceRange}
                onChange={setPriceRange}
                tipFormatter={value => `$${value}`}
              />
              <Space style={{ marginTop: 16 }}>
                <Text>${priceRange[0]}</Text>
                <Text>-</Text>
                <Text>${priceRange[1]}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={18}>
            <Row gutter={[24, 24]}>
              {paginatedProducts.map(product => (
                <Col xs={24} sm={12} lg={8} key={product.id}>
                  <Badge.Ribbon
                    text={product.price > 200 ? 'Premium' : 'Best Deal'}
                    color={product.price > 200 ? 'black' : 'green'}
                  >
                    <Card
                      hoverable
                      cover={
                        <Link to={`/product/${product.id}`}>
                          <img
                            alt={product.name}
                            src={product.image}
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
                        wishlist.includes(product.id)
                          ? <HeartFilled onClick={() => toggleWishlist(product.id)} style={{ color: '#ff4d4f' }} />
                          : <HeartOutlined onClick={() => toggleWishlist(product.id)} />
                      ]}
                    >
                      <Meta
                        title={<Link to={`/product/${product.id}`}>{product.name}</Link>}
                        description={
                          <Space direction="vertical" size={2}>
                            <Tag color="black">{product.category}</Tag>
                            <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                            <Text strong>${product.price}</Text>
                          </Space>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        <Row justify="center" style={{ marginTop: 24 }}>
          <Pagination
            current={currentPage}
            total={filteredAndSortedProducts.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showSizeChanger={false}
          />
        </Row>
      </Space>
    </div>
  );
};

export default Products;
