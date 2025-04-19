import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Row, Col, Card, Button, Rate, Tag, Image, Tabs, Input, Space, Divider, message } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Change the component name from ProductDetails to ProductDetail
const ProductDetail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Product data array
    const products = [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        price: 199.99,
        rating: 4.5,
        reviews: 128,
        description: "Experience premium sound quality with our wireless headphones. Features include noise cancellation, long battery life, and comfortable design.",
        features: [
          "Active Noise Cancellation",
          "40-hour Battery Life",
          "Bluetooth 5.0",
          "Premium Sound Quality"
        ],
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90",
          "https://images.unsplash.com/photo-1487215078519-e21cc028cb29"
        ],
        specs: {
          "Brand": "TCL Audio",
          "Model": "WH-1000",
          "Color": "Black",
          "Connectivity": "Wireless",
          "Weight": "250g"
        },
        stock: 15
      },
      {
        id: 2,
        name: "Smart Watch Pro",
        price: 299.99,
        rating: 4.8,
        reviews: 95,
        description: "Stay connected and track your fitness with this premium smartwatch featuring health monitoring and smartphone integration.",
        features: [
          "Heart Rate Monitor",
          "GPS Tracking",
          "Water Resistant",
          "5-day Battery Life"
        ],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a",
          "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9"
        ],
        specs: {
          "Brand": "TCL Smart",
          "Model": "SW-200",
          "Color": "Silver",
          "Display": "AMOLED",
          "Weight": "45g"
        },
        stock: 20
      },
      // Add more products as needed
    ];

    // Find the product based on the URL parameter id
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity
    };
    
    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    message.success('Added to cart successfully!');
  };

  return (
    <div className="product-detail">
      <Row gutter={[48, 24]}>
        {/* Product Images */}
        <Col xs={24} md={12}>
          <Card bordered={false}>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', height: 'auto' }}
            />
            <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
              {product.images.map((image, index) => (
                <Col span={8} key={index}>
                  <Image
                    src={image}
                    alt={`${product.name}-${index}`}
                    style={{ 
                      cursor: 'pointer',
                      opacity: selectedImage === index ? 1 : 0.6
                    }}
                    onClick={() => setSelectedImage(index)}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={12}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <div>
              <Tag color="black">{product.specs.Brand}</Tag>
              <Title level={2}>{product.name}</Title>
              <Space align="center">
                <Rate disabled defaultValue={product.rating} />
                <Text type="secondary">({product.reviews} reviews)</Text>
              </Space>
            </div>

            <Title level={3}>${product.price}</Title>

            <Space>
              <Button 
                icon={<MinusOutlined />} 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              />
              <Text strong>{quantity}</Text>
              <Button 
                icon={<PlusOutlined />} 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
              />
              <Text type="secondary">({product.stock} available)</Text>
            </Space>

            <Space size={16}>
              <Button 
                type="primary" 
                icon={<ShoppingCartOutlined />} 
                size="large"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button icon={<HeartOutlined />} size="large">Wishlist</Button>
              <Button icon={<ShareAltOutlined />} size="large">Share</Button>
            </Space>

            <Divider />

            <Tabs defaultActiveKey="1">
              <TabPane tab="Description" key="1">
                <Text>{product.description}</Text>
                <Title level={4} style={{ marginTop: 16 }}>Key Features</Title>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </TabPane>
              <TabPane tab="Specifications" key="2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <Row key={key} style={{ marginBottom: 8 }}>
                    <Col span={8}><Text strong>{key}</Text></Col>
                    <Col span={16}>{value}</Col>
                  </Row>
                ))}
              </TabPane>
              <TabPane tab="Reviews" key="3">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={4}>Customer Reviews</Title>
                  <Rate defaultValue={5} />
                  <TextArea rows={4} placeholder="Write your review..." />
                  <Button type="primary">Submit Review</Button>
                </Space>
              </TabPane>
            </Tabs>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;