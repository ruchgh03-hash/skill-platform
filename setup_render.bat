@echo off
title SkillPlatform Render Deployment Setup
echo ============================================
echo SkillPlatform SIH PS 26101 - Render Auto-Deploy
echo ============================================
echo.

:: Step 1: Check if Render CLI is available
echo Checking Render CLI...
render whoami >nul 2>&1
if %errorlevel% equ 0 (
    echo Render CLI found.
    echo.
) else (
    echo Render CLI not found in PATH.
    echo.
    echo "Option 1: Install Render CLI"
    echo "  Run: curl -fsSL https://raw.githubusercontent.com/render-oss/cli/refs/heads/main/bin/install.sh | bash"
    echo.
    echo "Option 2: Use Web Dashboard (Recommended)"
    echo "  1. Go to https://render.com/dashboard"
    echo "  2. Click 'New +' -> 'Blueprint'"
    echo "  3. Connect your GitHub repo: ruchgh03-hash/skill-platform"
    echo.
    goto END
)

:: Step 2: Deploy via CLI
echo Deploying via Render CLI...
render services create --from render.yaml >nul
if %errorlevel% equ 0 (
    echo.
    echo "✅ Deployment initiated via CLI!"
    echo "   Check your Render dashboard for progress."
) else (
    echo.
    echo "⚠️ CLI deployment failed."
    echo "  Falling back to Web Dashboard instructions..."
    echo.
)

:WEB_INST
echo.
echo "============================================"
echo "WEB DASHBOARD SETUP (Required for VITE_API_URL)"
echo =============================================
echo.
echo "After the deployment above, complete these steps:"
echo.
echo "1. Go to: https://render.com/dashboard"
echo "2. Click 'skill-platform-frontend' (Static Site)"
echo "3. Click on 'Environment' tab"
echo "4. Click 'Add Variable'"
echo "5. Enter:"
echo "   Key: VITE_API_URL"
echo "   Value: https://skill-platform-api.onrender.com"
echo.
echo "6. Click 'Create Variable'"
echo.
echo "7. Wait 2-3 minutes, then visit your frontend URL"
echo.
echo "============================================"
echo "Your URLs after setup:"
echo "  Frontend: https://skill-platform-frontend.onrender.com"
echo "  Backend:  https://skill-platform-api.onrender.com"
echo.

:END
echo.
echo ============================================
echo Deployment setup complete.
echo ============================================
echo.
echo "Next steps:"
echo "1. Visit https://render.com/dashboard"
echo "2. Follow steps 1-7 above"
echo "3. Test your live site!"
echo.
pause