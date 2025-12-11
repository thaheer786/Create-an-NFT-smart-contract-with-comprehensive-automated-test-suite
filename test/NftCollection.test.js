const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftCollection", function () {
  let owner, alice, bob, operator;
  let Nft, nft;
  const NAME = "MyNFT";
  const SYMBOL = "MNFT";
  const MAX_SUPPLY = 5;
  const BASE_URI = "https://example.com/metadata/";

  beforeEach(async () => {
    [owner, alice, bob, operator] = await ethers.getSigners();
    Nft = await ethers.getContractFactory("NftCollection");
    nft = await Nft.deploy(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
    await nft.waitForDeployment();
  });

  it("initial state: name, symbol, maxSupply, totalSupply = 0", async () => {
    expect(await nft.name()).to.equal(NAME);
    expect(await nft.symbol()).to.equal(SYMBOL);
    expect(await nft.maxSupply()).to.equal(BigInt(MAX_SUPPLY));
    expect(await nft.totalSupply()).to.equal(0n);
  });

  it("only owner can mint, mint increments totalSupply and balances", async () => {
    await expect(nft.connect(alice).safeMint(alice.address, 1))
      .to.be.revertedWith("Ownable: caller is not the owner");

    await nft.safeMint(alice.address, 1);

    expect(await nft.totalSupply()).to.equal(1n);
    expect(await nft.balanceOf(alice.address)).to.equal(1n);
    expect(await nft.ownerOf(1)).to.equal(alice.address);
  });

  it("prevent zero-address minting", async () => {
    await expect(nft.safeMint(ethers.ZeroAddress, 1)).to.be.reverted;
  });

  it("prevent double minting same tokenId", async () => {
    await nft.safeMint(alice.address, 1);
    await expect(nft.safeMint(bob.address, 1)).to.be.reverted;
  });

  it("enforce tokenId range and maxSupply", async () => {
    await expect(nft.safeMint(alice.address, 0)).to.be.reverted;
    await expect(nft.safeMint(alice.address, MAX_SUPPLY + 1)).to.be.reverted;

    for (let i = 1; i <= MAX_SUPPLY; i++) {
      await nft.safeMint(owner.address, i);
    }

    expect(await nft.totalSupply()).to.equal(BigInt(MAX_SUPPLY));

    await expect(nft.safeMint(owner.address, MAX_SUPPLY)).to.be.reverted;
    await expect(nft.safeMint(owner.address, MAX_SUPPLY + 1)).to.be.reverted;
  });

  it("transfer by owner updates balances & ownership", async () => {
    await nft.safeMint(alice.address, 1);

    await nft.connect(alice).transferFrom(alice.address, bob.address, 1);

    expect(await nft.ownerOf(1)).to.equal(bob.address);
    expect(await nft.balanceOf(alice.address)).to.equal(0n);
    expect(await nft.balanceOf(bob.address)).to.equal(1n);
  });

  it("approve and transfer via approved account", async () => {
    await nft.safeMint(alice.address, 1);

    await nft.connect(alice).approve(bob.address, 1);
    expect(await nft.getApproved(1)).to.equal(bob.address);

    await nft.connect(bob).transferFrom(alice.address, operator.address, 1);
    expect(await nft.ownerOf(1)).to.equal(operator.address);
  });

  it("operator approval (setApprovalForAll)", async () => {
    await nft.safeMint(alice.address, 1);

    await nft.connect(alice).setApprovalForAll(operator.address, true);
    expect(await nft.isApprovedForAll(alice.address, operator.address)).to.equal(true);

    await nft.connect(operator).transferFrom(alice.address, bob.address, 1);
    expect(await nft.ownerOf(1)).to.equal(bob.address);
  });

  it("burn updates totalSupply and ownerOf reverts afterwards", async () => {
    await nft.safeMint(alice.address, 1);

    // Owner does NOT need approval to burn their own token
    await nft.connect(alice).burn(1);

    await expect(nft.ownerOf(1)).to.be.reverted;
    expect(await nft.totalSupply()).to.equal(0n);
  });

  it("tokenURI returns correct metadata path", async () => {
    await nft.safeMint(alice.address, 1);

    expect(await nft.tokenURI(1)).to.equal(BASE_URI + "1");
    await expect(nft.tokenURI(999)).to.be.reverted;
  });

  it("pausing prevents minting", async () => {
    await nft.pause();
    await expect(nft.safeMint(alice.address, 1)).to.be.reverted;

    await nft.unpause();
    await nft.safeMint(alice.address, 1);
  });

  it("ApprovalForAll event emitted", async () => {
    await expect(nft.connect(alice).setApprovalForAll(operator.address, true))
      .to.emit(nft, "ApprovalForAll")
      .withArgs(alice.address, operator.address, true);
  });

  it("gas: mint + transfer should be below ~400k", async () => {
    const nft2 = await Nft.deploy(NAME, SYMBOL, MAX_SUPPLY, BASE_URI);
    await nft2.waitForDeployment();

    const mintTx = await nft2.safeMint(alice.address, 1);
    const mintGas = (await mintTx.wait()).gasUsed;

    const transferTx = await nft2.connect(alice).transferFrom(alice.address, bob.address, 1);
    const transferGas = (await transferTx.wait()).gasUsed;

    const totalGas = mintGas + transferGas;

    expect(totalGas < 400000n).to.equal(true);
  });
});
