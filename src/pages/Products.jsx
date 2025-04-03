import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Rate, Tag, Space, Button, Select, message, Input, Slider, Badge, Pagination } from 'antd';
import { ShoppingCartOutlined, SearchOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';

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

  const pageSize = 12;

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: 199.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      category: "Electronics",
      description: "Experience premium sound quality with our wireless headphones featuring active noise cancellation and long battery life.",
      features: ["Active Noise Cancellation", "40-hour Battery Life", "Bluetooth 5.0", "Premium Sound Quality"],
      specs: {
        "Brand": "TCL Audio",
        "Model": "WH-1000",
        "Color": "Black",
        "Connectivity": "Wireless",
        "Weight": "250g"
      },
      stock: 15,
      additionalImages: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90",
        "https://images.unsplash.com/photo-1487215078519-e21cc028cb29"
      ]
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 299.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      category: "Electronics",
      description: "Stay connected and track your fitness with this premium smartwatch featuring health monitoring and smartphone integration.",
      features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "5-day Battery Life"],
      specs: {
        "Brand": "TCL Smart",
        "Model": "SW-200",
        "Color": "Silver",
        "Display": "AMOLED",
        "Weight": "45g"
      },
      stock: 20,
      additionalImages: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"
      ]
    },
    {
      id: 3,
      name: "Leather Weekend Bag",
      price: 159.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      category: "Fashion"
    },
    {
      id: 4,
      name: "Premium Coffee Maker",
      price: 89.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5",
      category: "Home"
    },
    {
      id: 5,
      name: "4K Gaming Monitor",
      price: 449.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
      category: "Electronics"
    },
    {
      id: 6,
      name: "Designer Sunglasses",
      price: 129.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      category: "Fashion"
    },
    {
      id: 7,
      name: "Wireless Gaming Mouse",
      price: 79.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
      category: "Electronics"
    },
    {
      id: 8,
      name: "Smart Home Speaker",
      price: 159.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc",
      category: "Electronics"
    },
    {
      id: 9,
      name: "Minimalist Desk Lamp",
      price: 49.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
      category: "Home"
    },
    {
      id: 10,
      name: "Premium Backpack",
      price: 89.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      category: "Fashion"
    },
  
    // Additional 6 products
    {
      id: 11,
      name: "Electric Toothbrush",
      price: 89.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1563208682-e42959d15d16",
      category: "Health & Beauty",
      description: "Upgrade your oral care with our electric toothbrush featuring multiple brushing modes and a long-lasting battery.",
      features: ["Multiple Brushing Modes", "Rechargeable", "Waterproof", "2-Minute Timer"],
      specs: {
        "Brand": "OralCare",
        "Model": "OC-150",
        "Color": "White",
        "Connectivity": "None",
        "Weight": "150g"
      },
      stock: 30
    },
    {
      id: 12,
      name: "Gaming Chair",
      price: 199.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1563211377-49c9d69b3c6f",
      category: "Furniture",
      description: "A comfortable gaming chair designed for long hours of play, featuring ergonomic support and adjustable settings.",
      features: ["Ergonomic Design", "Adjustable Armrests", "360-Degree Rotation", "Durable Materials"],
      specs: {
        "Brand": "GameZone",
        "Model": "GZ-5000",
        "Color": "Black & Red",
        "Material": "PU Leather",
        "Weight": "12kg"
      },
      stock: 10
    },
    {
      id: 13,
      name: "Cordless Vacuum Cleaner",
      price: 179.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1572895390193-8250738363e5",
      category: "Home Appliances",
      description: "A powerful and lightweight cordless vacuum cleaner for quick and efficient cleaning around your home.",
      features: ["Cordless Design", "Long Battery Life", "Multiple Attachments", "Lightweight"],
      specs: {
        "Brand": "CleanMax",
        "Model": "CM-3000",
        "Color": "Silver",
        "Power": "120W",
        "Weight": "2.5kg"
      },
      stock: 25
    },
    {
      id: 14,
      name: "Noise Cancelling Earbuds",
      price: 129.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1603762647602-8bbac74639eb",
      category: "Electronics",
      description: "Block out the noise and enjoy high-quality sound with these wireless noise-cancelling earbuds.",
      features: ["Active Noise Cancelling", "Touch Control", "Bluetooth 5.0", "IPX4 Water Resistance"],
      specs: {
        "Brand": "AudioTech",
        "Model": "AT-200",
        "Color": "Black",
        "Connectivity": "Bluetooth",
        "Weight": "35g"
      },
      stock: 40
    },
    {
      id: 15,
      name: "Yoga Mat",
      price: 39.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1571971067347-e1074b83ffb9",
      category: "Sports & Outdoors",
      description: "A high-quality yoga mat that provides the perfect balance of cushion and support for your practice.",
      features: ["Non-slip Surface", "Extra Thick", "Durable", "Lightweight"],
      specs: {
        "Brand": "FlexFit",
        "Model": "FF-100",
        "Color": "Blue",
        "Material": "PVC",
        "Weight": "1kg"
      },
      stock: 50
    },
    {
      id: 16,
      name: "Portable Bluetooth Speaker",
      price: 79.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1533064310285-1d68fe7ab0e1",
      category: "Electronics",
      description: "Enjoy your favorite music anywhere with this portable Bluetooth speaker featuring rich sound and long battery life.",
      features: ["Bluetooth 5.0", "Water-resistant", "12-hour Playtime", "Compact Size"],
      specs: {
        "Brand": "SoundWave",
        "Model": "SW-100",
        "Color": "Black",
        "Connectivity": "Bluetooth",
        "Weight": "500g"
      },
      stock: 60
    }
  ];
  

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
