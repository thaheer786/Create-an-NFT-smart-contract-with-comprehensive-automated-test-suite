NftCollection — ERC-721 NFT Smart Contract (Hardhat + Docker)
Overview

This project implements a fully ERC-721–compatible NFT smart contract with:

Owner-only minting

Maximum supply enforcement

Pause / unpause control

Metadata via baseURI/tokenId

Burn functionality

Safe transfers, approvals, operator approvals

Complete automated test suite

Fully Dockerized test environment

The goal is to produce a clean, secure, production-ready NFT contract that follows best practices and passes a comprehensive automated test suite.

Tech Stack

Solidity 0.8.19

Hardhat

Ethers.js v6

OpenZeppelin Contracts

Mocha + Chai (with hardhat-chai-matchers)

Docker (Node.js 18 base image)

Project Structure
project-root/
├── contracts/
│   └── NftCollection.sol
├── test/
│   └── NftCollection.test.js
├── Dockerfile
├── .dockerignore
├── hardhat.config.js
├── package.json
└── README.md

Features
✔ ERC-721 Standard

Implements all required ERC-721 functions:
ownerOf, balanceOf, approve, transferFrom, safeTransferFrom, isApprovedForAll, etc.

✔ Minting (Owner-only)

Token ID must be between 1 and maxSupply.

✔ maxSupply Enforcement

Minting beyond maximum supply reverts.

✔ Pausable

Owner can pause and unpause minting.

✔ Metadata

Token URI follows:

baseURI + tokenId

✔ Burning

Burn allowed for owner or approved operator; totalSupply updates correctly.

✔ Full Test Suite

Covers:

Minting

Transfers

Approvals

Pausing

Burning

Metadata

Invalid operations

Events

Gas usage

✔ Docker Support

Run all tests in a clean environment:

docker run --rm nft-contract

How to Run (Locally)
Install dependencies:
npm install

Compile:
npx hardhat compile

Run tests:
npx hardhat test

Run With Docker (Recommended)
Build image:
docker build -t nft-contract .

Run tests inside container:
docker run --rm nft-contract

Security Notes

Based on OpenZeppelin audited ERC-721

Validates token ID range

Prevents zero-address mint

Prevents duplicate token IDs

Atomic state changes

No unsafe external calls

Test Coverage Summary

Tests verify:

✔ Initial state

✔ Minting

✔ Access control

✔ Pausing

✔ Approvals

✔ Transfers

✔ Burning

✔ Metadata

✔ Reverts

✔ Events

✔ Gas limits

All tests successfully pass.

License

MIT License.

Author

Thaheer Shaik