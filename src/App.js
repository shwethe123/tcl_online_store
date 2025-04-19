// ... existing imports ...
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <Router>
      // ... existing code ...
      <Routes>
        // ... other routes ...
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </Router>
  );
}