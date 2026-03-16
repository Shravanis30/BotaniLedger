#!/bin/bash

# BotaniLedger Network Down Script

echo "Bringing down BotaniLedger Hyperledger Fabric Network..."

cd blockchain/network
docker-compose down -v

echo "Network stopped and volumes removed."
