import axios from 'axios';

// Example of how to set a base URL for the API
const API_URL = 'http://192.168.16.32:5000/api';

// Fetch products from the API
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/store`);
    return response.data; // assuming the response contains the products
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// You can add more API calls here as needed, for example:
// - Fetch a single product by ID
// - Add a product to cart
// - Update cart, etc.
