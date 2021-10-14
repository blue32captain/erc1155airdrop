const ERC1155Mock = artifacts.require("ERC1155Mock");
const ERC1155Airdrop = artifacts.require("ERC1155Airdrop");

module.exports = async function (deployer) {
  await deployer.deploy(ERC1155Airdrop, ERC1155Mock.address);

  return;
};
