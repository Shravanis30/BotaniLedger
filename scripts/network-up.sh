#!/bin/bash

# BotaniLedger Network Up Script
# This script starts the Fabric network containers

echo "Starting BotaniLedger Hyperledger Fabric Network..."

if [ ! -d "blockchain/network" ]; then
  echo "Error: blockchain/network directory not found"
  exit 1
fi

cd blockchain/network
docker-compose up -d

echo "Network containers are running."
docker ps | grep hyperledger
