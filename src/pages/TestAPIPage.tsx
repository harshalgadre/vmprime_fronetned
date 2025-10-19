import React, { useState, useEffect } from 'react';
import { testProductsAPI, testContactAPI } from '@/test-api';

const TestAPIPage = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsResult = await testProductsAPI();
      const contactResult = await testContactAPI();
      
      setTestResults({
        products: productsResult,
        contact: contactResult,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
      console.error('Test failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run tests when component mounts
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Testing API connection...
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {testResults && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Success!</p>
          <p>API connection test completed at {testResults.timestamp}</p>
          <p>Retrieved {testResults.products?.length || 0} products</p>
        </div>
      )}
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run API Tests'}
      </button>
      
      {testResults && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestAPIPage;