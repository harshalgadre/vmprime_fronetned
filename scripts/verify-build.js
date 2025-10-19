// Script to verify the production build
import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('=== Verifying Production Build ===');

try {
  // Check if dist directory exists
  if (existsSync('./dist')) {
    console.log('✅ Dist directory exists');
  } else {
    console.log('❌ Dist directory does not exist');
    process.exit(1);
  }

  // Check if index.html exists in dist
  if (existsSync('./dist/index.html')) {
    console.log('✅ index.html exists in dist');
  } else {
    console.log('❌ index.html does not exist in dist');
    process.exit(1);
  }

  // Check if assets directory exists
  if (existsSync('./dist/assets')) {
    console.log('✅ Assets directory exists');
  } else {
    console.log('⚠️  Assets directory does not exist (may be ok)');
  }

  console.log('=== Build Verification Complete ===');
  console.log('✅ Build is ready for deployment');
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}