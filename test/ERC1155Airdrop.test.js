const ERC1155Mock = artifacts.require("ERC1155Mock");
const ERC1155Airdrop = artifacts.require("ERC1155Airdrop");

contract("ERC1155Airdrop", (accounts) => {
    var erc1155mock_contract;
    var airdrop_contract;
    const tokenId = "0x222222229bd51a8f1fd5a5f74e4a256513210caf2ade63cd25c7e4c654174612"; // Randomly chosen

    before(async () => {
        await ERC1155Mock.new(
            "", // contractURI
            { from: accounts[0] }
        ).then(function (instance) {
            erc1155mock_contract = instance;
            console.log('mock address: ', erc1155mock_contract.address);
        });

        await ERC1155Airdrop.new(
            erc1155mock_contract.address,
            { from: accounts[0] }
        ).then(function (instance) {
            airdrop_contract = instance;
            console.log('airdrop address: ', airdrop_contract.address);
        });

        await mint(accounts[1], tokenId, 5);
    });

    const mint = async (minter, tokenId, amount) => {
        console.log('account0: ', accounts[0]);
        await erc1155mock_contract.mint(
            tokenId,
            amount,
            { from: minter }
        );
    };

    describe("Airdrop", () => {
        it("not working if owner have insufficient balance", async () => {
            const recipients = [
                accounts[2],
                accounts[3],
                accounts[4],
                accounts[5],
                accounts[6],
                accounts[7],
            ];

            let thrownError;
            try {
                await airdrop_contract.airdrop(
                    tokenId,
                    recipients,
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }
            assert.include(thrownError.message, "Caller does not have amount of tokens");
        })
        it("not working without owner approval", async () => {
            const recipients = [
                accounts[2],
                accounts[3],
                accounts[4],
                accounts[5],
                accounts[6],
            ];

            let thrownError;
            try {
                await airdrop_contract.airdrop(
                    tokenId,
                    recipients,
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }
            assert.include(thrownError.message, "Owner has not approved");
        })
        it("not working out of range", async () => {
            await erc1155mock_contract.setApprovalForAll(
                airdrop_contract.address,
                true,
                { from: accounts[1] }
            );
            const recipients = [
                accounts[2],
                accounts[3],
                accounts[4],
                accounts[5],
                accounts[6],
            ];

            let thrownError;
            try {
                await airdrop_contract.airdrop(
                    tokenId,
                    recipients,
                    { from: accounts[1] }
                );
            } catch (error) {
                thrownError = error;
            }
            assert.include(thrownError.message, "Recipients should be greater than 100");
        })
        it("Works fine with normal flow", async () => {
            await erc1155mock_contract.setApprovalForAll(
                airdrop_contract.address,
                true,
                { from: accounts[1] }
            );
            const recipients = [
                accounts[2],
                accounts[3],
                accounts[4],
                accounts[5],
                accounts[6],
            ];

            await airdrop_contract.airdrop(
                tokenId,
                recipients,
                { from: accounts[1] }
            );

            assert.equal(
                await erc1155mock_contract.balanceOf(
                    accounts[1],
                    tokenId
                ),
                0
            );

            for (let i = 0; i < recipients.length; i++) {
                assert.equal(
                    await erc1155mock_contract.balanceOf(
                        recipients[i],
                        tokenId
                    ),
                    1
                );
            }
        });
    })
});
