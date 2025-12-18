#!/usr/bin/env node

/**
 * Phase 1 Frontend Components Verification
 * 
 * Verifies that all new frontend components are properly structured
 */

const fs = require('fs');
const path = require('path');

// Components to verify
const COMPONENTS = [
  {
    name: 'SearchBar',
    files: [
      'frontend/src/components/SearchBar.js',
      'frontend/src/components/SearchBar.module.css'
    ]
  },
  {
    name: 'ProductQA',
    files: [
      'frontend/src/components/ProductQA.js',
      'frontend/src/components/ProductQA.module.css'
    ]
  },
  {
    name: 'ProductComparison',
    files: [
      'frontend/src/components/ProductComparison.js',
      'frontend/src/components/ProductComparison.module.css'
    ]
  },
  {
    name: 'PriceBreakdown',
    files: [
      'frontend/src/components/PriceBreakdown.js',
      'frontend/src/components/PriceBreakdown.module.css'
    ]
  },
  {
    name: 'ComparisonContext',
    files: [
      'frontend/src/context/ComparisonContext.js'
    ]
  }
];

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function checkFile(filePath) {
  try {
    const fullPath = path.join('c:/Users/HI/Desktop/Zentromall', filePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      return {
        exists: true,
        size: sizeKB,
        path: fullPath
      };
    }
    return { exists: false };
  } catch (error) {
    return { exists: false, error: error.message };
  }
}

async function verify() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║     PHASE 1 FRONTEND COMPONENTS VERIFICATION                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  let totalFiles = 0;
  let existingFiles = 0;
  const results = [];

  COMPONENTS.forEach(component => {
    console.log(`\n📦 ${colors.cyan}${component.name}${colors.reset}`);
    
    component.files.forEach(filePath => {
      totalFiles++;
      const check = checkFile(filePath);
      
      if (check.exists) {
        existingFiles++;
        console.log(`   ${colors.green}✅${colors.reset} ${path.basename(filePath)} (${check.size}KB)`);
        results.push({ component: component.name, file: filePath, status: 'OK' });
      } else {
        console.log(`   ${colors.red}❌${colors.reset} ${path.basename(filePath)} (MISSING)`);
        results.push({ component: component.name, file: filePath, status: 'MISSING' });
      }
    });
  });

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                     VERIFICATION SUMMARY                       ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log(`Total Files: ${totalFiles}`);
  console.log(`${colors.green}Found: ${existingFiles}${colors.reset}`);
  console.log(`${colors.red}Missing: ${totalFiles - existingFiles}${colors.reset}`);
  console.log(`Coverage: ${((existingFiles / totalFiles) * 100).toFixed(0)}%\n`);

  if (existingFiles === totalFiles) {
    console.log(`${colors.green}✅ All frontend components are ready!${colors.reset}\n`);
    return 0;
  } else {
    console.log(`${colors.red}❌ Some components are missing!${colors.reset}\n`);
    return 1;
  }
}

verify().then(code => process.exit(code));
