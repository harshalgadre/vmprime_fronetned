// Simple connection test script
const testConnection = async () => {
  try {
    console.log('Testing connection to backend on http://localhost:5000...');
    
    // Test a simple GET request to the products endpoint
    const response = await fetch('http://localhost:5000/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Connection successful!');
    console.log(`✅ Retrieved ${data.length} products`);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Run the test
testConnection().then(result => {
  console.log('Test completed:', result);
});

export default testConnection;