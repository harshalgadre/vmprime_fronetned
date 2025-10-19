@echo off
REM Cleanup script to remove unnecessary files before deployment

echo Cleaning up unnecessary files...

REM Remove any remaining test or development files
del /Q src\test-*.js 2>nul
del /Q backend-test.js 2>nul
del /Q *.md 2>nul

REM Keep only essential documentation
echo RENDER_DEPLOYMENT_GUIDE.md > KEEP
echo DEPLOYMENT_SUMMARY.md >> KEEP
if exist RENDER_DEPLOYMENT_GUIDE.md move RENDER_DEPLOYMENT_GUIDE.md temp_render.md
if exist DEPLOYMENT_SUMMARY.md move DEPLOYMENT_SUMMARY.md temp_deploy.md
for %%i in (*.md) do if exist "%%i" del "%%i"
if exist temp_render.md move temp_render.md RENDER_DEPLOYMENT_GUIDE.md
if exist temp_deploy.md move temp_deploy.md DEPLOYMENT_SUMMARY.md
del KEEP 2>nul

echo Cleanup complete!
echo Ready for deployment to Render.