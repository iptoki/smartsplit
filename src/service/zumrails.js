const got = require('got')
const Config = require('../config')

const API_URL = 'https://api-sandbox.zumrails.com'

function Zumrails(opts = {}) {
	this.apiUsername = opts.apiUsername || Config.zumrails.apiUsername
	this.apiPassword = opts.apiPassword || Config.zumrails.apiPassword
	this.walletId = opts.walletId || Config.zumrails.walletId
	this.fundingSourceId = opts.fundingSourceId || Config.zumrails.fundingSourceId
	this.accessTokenExpireDate = Date.now()
	this.accessToken = undefined
	this.customerId = undefined

	if (!this.apiUsername) {
		throw new Error('apiUsername is required')
	}

	if (!this.apiPassword) {
		throw new Error('apiPassword is required')
	}

	this.getAccessToken()
}

Zumrails.prototype.apiRequest = async function apiRequest(
	method,
	path,
	body = {},
	auth = true
) {
	const opts = { body, json: true }
	if (auth)
		opts.headers = { Authorization: `Bearer ${await this.getAccessToken()}` }
	try {
		return await got[method](API_URL + path, opts)
	} catch (err) {
		throw new Error(
			'Zumrails API Request failed with error: ' +
				JSON.stringify({
					url: `${err.method} ${err.url}`,
					statusCode: err.statusCode,
					statusMessage: err.statusMessage,
					body: err.body
				})
		)
	}
}

Zumrails.prototype.getFundingSources = function getFundingSources() {
	return this.apiRequest('get', '/api/fundingsource/filter')
}

Zumrails.prototype.getWallets = function getWallets() {
	return this.apiRequest('get', '/api/wallet')
}

Zumrails.prototype.withdrawZumWallet = function withdrawZumWallet(amount) {
	return this.apiRequest('post', '/api/transaction', {
		ZumRailsType: 'WithdrawZumWallet',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		FundingSourceId: this.fundingSourceId,
	})
}

Zumrails.prototype.fundZumWallet = function fundZumWallet(amount) {
	return this.apiRequest('post', '/api/transaction', {
		ZumRailsType: 'FundZumWallet',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		FundingSourceId: this.fundingSourceId,
	})
}

Zumrails.prototype.fundUser = function fundUser(amount, userId) {
	return this.apiRequest('post', '/api/transaction', {
		ZumRailsType: 'AccountsPayable',
		TransactionMethod: 'Eft',
		Amount: amount,
		WalletId: this.walletId,
		UserId: userId,
	})
}

Zumrails.prototype.withdrawUser = function withdrawUser(amount, userId) {
	return this.apiRequest('post', '/api/transaction', {
		ZumRailsType: 'AccountsReceivable',
		TransactionMethod: 'Eft',
		Amount: amount,
		UserId: userId,
		WalletId: this.walletId,
	})
}

Zumrails.prototype.userTransfer = function userTransfer(
	amount,
	userFrom,
	userTo
) {
	return this.apiRequest('post', '/api/transaction', {
		ZumRailsType: 'UserTransfer',
		TransactionMethod: 'Eft',
		Amount: amount,
		UserId: userFrom,
		TargetUserId: userTo,
	})
}

Zumrails.prototype.authorize = function authorize() {
	return this.apiRequest('post', '/api/authorize', {
		Username: this.apiUsername,
		Password: this.apiPassword,
	}, false)
}

Zumrails.prototype.getAccessToken = async function getAccessToken() {
	if (this.accessToken && Date.now() < this.accessTokenExpireDate)
		return this.accessToken
	const res = await this.authorize()
	if (!res) throw new Error('Invalid credentials, cannot obtain access token')
	this.accessToken = res.body.result.Token
	this.accessTokenExpireDate = Date.now() + 3300
	this.customerId = res.body.result.CustomerId
	return this.accessToken
}

const zumrails = new Zumrails()

module.exports = zumrails
