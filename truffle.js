var HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = 'artist wish disease fever stairs grit organ reflect put estate either beach';

module.exports = {
	networks: {
		dev: {
			host: "127.0.0.1",
			port: 9545,
			network_id: "*" // Match any network id
		},
		private: {
			host: "127.0.0.1",
			port: 8545,
			network_id: "*", // Match any network id
			from: "0x390d55318c64592c58636ac82fea4f16a84ee34a",
   			gas: 1058406
		},
		ropsten: {
			provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"),
			network_id: 3,
   			gas: 1058406
		}
	}
};