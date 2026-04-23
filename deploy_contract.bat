@echo off
echo Stage 1: Building Soroban contract...
stellar contract build
echo.
echo Stage 2: Deploying to Testnet...
echo Make sure you have an account named 'admin' or replace it in this script.
stellar contract deploy --wasm target/wasm32v1-none/release/hello_world.wasm --source admin --network testnet
echo.
echo IMPORTANT: Once deployed, copy the Contract ID and paste it into App.tsx (line 15).
pause
