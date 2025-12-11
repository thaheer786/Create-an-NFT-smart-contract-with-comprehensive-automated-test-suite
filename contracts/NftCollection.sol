// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/*
  NftCollection.sol

  ERC-721 compatible NFT contract with:
   - owner-only minting
   - maxSupply enforcement
   - pause/unpause for minting
   - baseURI metadata
   - burn support
   - events + strong validation
*/

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NftCollection is ERC721, Ownable, Pausable {
    using Strings for uint256;

    uint256 public immutable maxSupply;
    uint256 private _totalSupply;
    string private _baseTokenURI;

    error ExceedsMaxSupply(uint256 requested, uint256 maxSupply);
    error TokenAlreadyExists(uint256 tokenId);
    error NonExistentToken(uint256 tokenId);
    error ZeroAddress();
    error TokenIdOutOfRange(uint256 tokenId);

    event BaseURIChanged(string newBaseURI);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        string memory baseURI_
    ) ERC721(name_, symbol_) {
        require(maxSupply_ > 0, "maxSupply must be > 0");
        maxSupply = maxSupply_;
        _baseTokenURI = baseURI_;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function safeMint(address to, uint256 tokenId) external onlyOwner whenNotPaused {
        if (to == address(0)) revert ZeroAddress();
        if (_exists(tokenId)) revert TokenAlreadyExists(tokenId);
        if (tokenId == 0 || tokenId > maxSupply) revert TokenIdOutOfRange(tokenId);
        if (_totalSupply + 1 > maxSupply) revert ExceedsMaxSupply(_totalSupply + 1, maxSupply);

        _totalSupply += 1;
        _safeMint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        require(_isApprovedOrOwner(msg.sender, tokenId), "caller-not-owner-or-approved");
        _burn(tokenId);
        _totalSupply -= 1;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (!_exists(tokenId)) revert NonExistentToken(tokenId);
        string memory base = _baseTokenURI;
        return bytes(base).length > 0 ? string(abi.encodePacked(base, tokenId.toString())) : "";
    }
}
