// Simple backend test script
const testBackendConnection = async () => {
  try {
    console.log('Testing direct connection to backend on http://localhost:5000...');
    
    // Test a simple GET request to the products endpoint
    const response = await fetch('http://localhost:5000/api/products');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Direct connection to backend successful!');
    console.log(`✅ Retrieved ${data.length} products`);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ Direct connection to backend failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Run the test
if (typeof window === 'undefined') {
  // Running in Node.js environment
  testBackendConnection().then(result => {
    console.log('Backend test completed:', result);
  });
}

export default testBackendConnection;