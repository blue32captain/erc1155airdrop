const ERC1155Mock = artifacts.require("ERC1155Mock");

module.exports = function (deployer) {
  deployer.deploy(
    ERC1155Mock,
    "", // contractURI
  );
};
