const got = require('got')
const Config = require('../config')

const API_URL = 'https://api-sandbox.zumrails.com'

function Zumrails(opts = {}) {
	this.apiUsername = opts.apiUsername || Config.zumrails.apiUsername
	this.apiPassword = opts.apiPassword || Config.zumrails.apiPassword
	this.walletId = opts.walletId || Config.zumrails.walletId
	this.fundingSourceId = opts.fundingSourceId || Config.zumrails.fundingSourceId
	this.accessToken = undefined
	this.customerId = undefined

	if (!this.apiUsername) {
		throw new Error('apiUsername is required')
	}

	if (!this.apiPassword) {
		throw new Error('apiPassword is required')
	}

	this.authorize()
		.then((res) => {
			this.accessToken = res.body.result.Token
			this.customerId = res.body.result.CustomerId
		})
		.catch((err) => {
			console.log('Invalid credentials, cannot obtain access token')
		})
}

Zumrails.prototype.getFundingSources = function getFundingSources() {
	return got.post(`${API_URL}/api/fundingsource/filter`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
	})
}

Zumrails.prototype.getWallets = function getFundingSources() {
	return got.get(`${API_URL}/api/wallet`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
	})
}

Zumrails.prototype.withdrawZumWallet = function withdrawZumWallet(amount) {
	return got.post(`${API_URL}/api/transaction`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
		body: {
			ZumRailsType: 'WithdrawZumWallet',
			TransactionMethod: 'Eft',
			Amount: amount,
			WalletId: this.walletId,
			FundingSourceId: this.fundingSourceId,
		},
	})
}

Zumrails.prototype.fundZumWallet = function fundZumWallet(amount) {
	return got.post(`${API_URL}/api/transaction`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
		body: {
			ZumRailsType: 'FundZumWallet',
			TransactionMethod: 'Eft',
			Amount: amount,
			WalletId: this.walletId,
			FundingSourceId: this.fundingSourceId,
		},
	})
}

Zumrails.prototype.fundUser = function fundUser(amount, userId) {
	return got.post(`${API_URL}/api/transaction`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
		body: {
			ZumRailsType: 'AccountsPayable',
			TransactionMethod: 'Eft',
			Amount: amount,
			WalletId: this.walletId,
			UserId: userId,
		},
	})
}

Zumrails.prototype.withdrawUser = function withdrawUser(amount, userId) {
	return got.post(`${API_URL}/api/transaction`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
		body: {
			ZumRailsType: 'AccountsReceivable',
			TransactionMethod: 'Eft',
			Amount: amount,
			UserId: userId,
			WalletId: this.walletId,
		},
	})
}

Zumrails.prototype.userTransfer = function userTransfer(
	amount,
	userFrom,
	userTo
) {
	return got.post(`${API_URL}/api/transaction`, {
		json: true,
		headers: { Authorization: `Bearer ${this.accessToken}` },
		body: {
			ZumRailsType: 'UserTransfer',
			TransactionMethod: 'Eft',
			Amount: amount,
			UserId: userFrom,
			TargetUserId: userTo,
		},
	})
}

Zumrails.prototype.authorize = function authorize() {
	return got.post(`${API_URL}/api/authorize`, {
		json: true,
		body: {
			Username: this.apiUsername,
			Password: this.apiPassword,
		},
	})
}

const zumrails = new Zumrails()

module.exports = zumrails
