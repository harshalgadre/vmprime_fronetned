#!/bin/bash
# Cleanup script to remove unnecessary files before deployment

echo "Cleaning up unnecessary files..."

# Remove any remaining test or development files
rm -f src/test-*.js
rm -f backend-test.js
rm -f *.md  # Remove markdown files except essential ones

# Keep only essential documentation
touch KEEP
echo "RENDER_DEPLOYMENT_GUIDE.md" >> KEEP
echo "DEPLOYMENT_SUMMARY.md" >> KEEP
mv RENDER_DEPLOYMENT_GUIDE.md temp_render.md
mv DEPLOYMENT_SUMMARY.md temp_deploy.md
rm -f *.md
mv temp_render.md RENDER_DEPLOYMENT_GUIDE.md
mv temp_deploy.md DEPLOYMENT_SUMMARY.md
rm KEEP

echo "Cleanup complete!"
echo "Ready for deployment to Render."