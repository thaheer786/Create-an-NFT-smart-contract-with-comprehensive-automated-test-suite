🌟 NftCollection — ERC-721 NFT Smart Contract (Hardhat + Docker)

A fully featured, production-ready ERC-721 NFT smart contract built using Solidity, Hardhat, OpenZeppelin, and Ethers.js v6 — complete with a comprehensive automated test suite and reproducible Docker environment. 

This project demonstrates secure smart contract design, strong test coverage, access control, metadata handling, and deployment best practices.

🚀 Features
🔐 Owner-Only Minting

Only the contract owner can mint new NFTs.
Prevents unauthorized minting and ensures controlled token distribution.

📈 Maximum Supply Enforcement

Each NFT has a fixed valid token range (1 → maxSupply).
Minting beyond max supply instantly reverts.

⏯️ Pausable Minting

Admin can pause/unpause minting using OpenZeppelin's Pausable for safety.

🖼️ Metadata Support

Token URI follows the pattern:

baseURI + tokenId


e.g., https://example.com/metadata/1

🔥 Burn Functionality

Token holders or approved operators can burn NFTs.
totalSupply updates correctly after burns.

🔄 Transfers, Approvals, Operator Approvals

Full ERC-721 implementation including:

approve

setApprovalForAll

safeTransferFrom

Event emission checks

🧪 Complete Automated Test Suite

Tests cover:

Minting

Approvals

Operator transfers

Transfers

Burning

Pausing

TokenURI logic

Failure scenarios

Event checks

Gas measurement

🐳 Dockerized Testing Environment

Run all tests inside a clean Docker container — no setup required.

🗂️ Project Structure
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

🛠️ Tech Stack

Solidity 0.8.19

Hardhat

Ethers.js v6

OpenZeppelin Contracts

Mocha + Chai

Hardhat Chai Matchers

Docker

Node.js 18

📦 Installation & Setup
1️⃣ Install dependencies
npm install

2️⃣ Compile smart contracts
npx hardhat compile

3️⃣ Run the full test suite
npx hardhat test

🐳 Run Using Docker (Recommended)
Build the image:
docker build -t nft-contract .

Run tests inside Docker:
docker run --rm nft-contract


This ensures consistent, isolated test results across any machine.

🧪 Test Coverage Summary

The automated test suite validates:

✔ Core ERC-721 compliance
✔ Minting rules (owner-only, no duplicates, token range)
✔ Transfers & safe transfers
✔ Approvals & operator approvals
✔ Pausing functionality
✔ Burning and supply tracking
✔ Metadata correctness
✔ Invalid operations revert
✔ Event emission
✔ Gas constraints for mint + transfer

All tests pass successfully.

🔒 Security Considerations

This project incorporates multiple industry best practices:

OpenZeppelin’s audited ERC-721 implementation

Owner-only restricted functions

No minting to zero address

TokenID validation

Prevents double minting

Reverts on invalid operations

Atomic state updates

No external re-entrancy risks

📄 License

This project is licensed under the MIT License.

👤 Author

Thahheer Shaik
