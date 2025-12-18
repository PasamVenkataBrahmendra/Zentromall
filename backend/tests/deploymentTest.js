#!/usr/bin/env node

/**
 * Phase 1 Deployment Test Suite
 * 
 * Tests all 10 new API endpoints to verify deployment
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:5000';
const TESTS = [
  // Search Endpoints (4)
  {
    name: 'Search Products',
    method: 'GET',
    path: '/api/search?query=laptop',
    expectedStatus: 200
  },
  {
    name: 'Get Search Suggestions',
    method: 'GET',
    path: '/api/search/suggestions?query=lap',
    expectedStatus: 200
  },
  {
    name: 'Get Search Filters',
    method: 'GET',
    path: '/api/search/filters',
    expectedStatus: 200
  },
  {
    name: 'Get Trending Searches',
    method: 'GET',
    path: '/api/search/trending',
    expectedStatus: 200
  },

  // Cart Pricing Endpoints (3)
  {
    name: 'Calculate Cart Total',
    method: 'POST',
    path: '/api/cart/calculate',
    body: { items: [], zipCode: '110001' },
    expectedStatus: 200
  },
  {
    name: 'Apply Coupon',
    method: 'POST',
    path: '/api/cart/coupon/TEST10',
    body: { cartTotal: 1000 },
    expectedStatus: 200
  },
  {
    name: 'Get Shipping Methods',
    method: 'GET',
    path: '/api/cart/shipping?subtotal=1000&zipCode=110001',
    expectedStatus: 200
  },

  // Q&A Endpoints (3)
  {
    name: 'Get Product Questions',
    method: 'GET',
    path: '/api/qa/product/507f1f77bcf86cd799439011',
    expectedStatus: 200
  },
  {
    name: 'Get Search Suggestions',
    method: 'GET',
    path: '/api/search/suggestions?query=test',
    expectedStatus: 200
  },
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    expectedStatus: 200
  }
];

// Test runner
function runTest(test, index) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + test.path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: test.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const passed = res.statusCode === test.expectedStatus;
        resolve({
          index: index + 1,
          name: test.name,
          path: test.path,
          method: test.method,
          status: res.statusCode,
          expected: test.expectedStatus,
          passed: passed,
          message: passed ? '✅ PASS' : '❌ FAIL'
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        index: index + 1,
        name: test.name,
        path: test.path,
        method: test.method,
        status: 'ERROR',
        expected: test.expectedStatus,
        passed: false,
        message: `❌ ERROR: ${error.message}`
      });
    });

    if (test.body) {
      req.write(JSON.stringify(test.body));
    }
    req.end();
  });
}

// Main execution
async function runAllTests() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           PHASE 1 DEPLOYMENT TEST SUITE                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log(`🔍 Testing ${TESTS.length} endpoints at ${BASE_URL}\n`);
  console.log('Running tests...\n');

  const results = [];
  for (let i = 0; i < TESTS.length; i++) {
    const result = await runTest(TESTS[i], i);
    results.push(result);
    console.log(`  [${result.index}/${TESTS.length}] ${result.message} - ${result.name}`);
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                        TEST RESULTS                            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log(`Total Tests: ${TESTS.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${((passed / TESTS.length) * 100).toFixed(0)}%\n`);

  if (failed > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name} (${r.method} ${r.path})`);
      console.log(`    Expected: ${r.expected}, Got: ${r.status}`);
    });
  }

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  if (failed === 0) {
    console.log('║        ✅ ALL TESTS PASSED - DEPLOYMENT READY! 🚀              ║');
  } else {
    console.log('║        ❌ SOME TESTS FAILED - CHECK DEPLOYMENT                  ║');
  }
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runAllTests();
