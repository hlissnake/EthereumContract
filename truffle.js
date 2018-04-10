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
      network_id: "*" // Match any network id
    }
  }
};