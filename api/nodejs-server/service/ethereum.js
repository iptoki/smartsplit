const Web3 = require("web3")
const ETHEREUM_WALLET = process.env.ETHEREUM_WALLET
const ETHEREUM_API = process.env.ETHEREUM_API

if(!ETHEREUM_API)
	throw new Error("No Ethereum API URL defined, aborting")

if(!ETHEREUM_WALLET)
	throw new Error("No ethereum wallet defined, limited functionnality only")

const client = new Web3(ETHEREUM_API)
const account = client.eth.accounts.privateKeyToAccount(ETHEREUM_WALLET)
client.eth.accounts.wallet.add(account)
client.eth.defaultAccount = account.address

console.log(ETHEREUM_API, ETHEREUM_WALLET, client.eth.defaultAccount)

module.exports = client
