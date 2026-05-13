@echo off
REM ============================================================
REM  Install figma-developer-mcp as a user-scope Claude Code MCP.
REM  One-time setup. Delete this file after the install succeeds.
REM
REM  Usage:
REM    setup-figma-mcp.cmd figd_YourFigmaPersonalAccessTokenHere
REM
REM  Token: generate at https://www.figma.com/settings
REM  Scopes: File content read, Library content read
REM ============================================================

if "%~1"=="" (
    echo.
    echo ERROR: No token provided.
    echo.
    echo Usage:
    echo   setup-figma-mcp.cmd ^<figma-personal-access-token^>
    echo.
    echo Example:
    echo   setup-figma-mcp.cmd figd_AbCdEfGhIjKlMnOpQrStUvWxYz...
    echo.
    exit /b 1
)

echo.
echo Installing figma-developer-mcp at user scope...
echo.

claude mcp add --scope user figma-developer-mcp -e FIGMA_API_KEY=%~1 -- npx -y figma-developer-mcp --stdio

echo.
echo --- DONE ---
echo.
echo Next steps:
echo   1. Run "claude mcp list" to verify figma-developer-mcp appears
echo   2. Close + reopen Claude Code
echo   3. First prompt next session: "List your available Figma tools"
echo.
echo Delete this file (setup-figma-mcp.cmd) after the install succeeds.
echo Keeping a token-aware script around is a security risk.
