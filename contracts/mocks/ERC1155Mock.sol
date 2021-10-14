// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Mock is ERC1155 {
  string private _uri;

  constructor(string memory uri_) ERC1155(uri_) {
    _uri = uri_;
  }

  function mint(
    uint256 id_,
    uint256 amount_
    ) public {
      _mint(_msgSender(), id_, amount_, "");
    }
}
