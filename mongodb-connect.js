const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

module.exports = class MongoDbConnect {
	async connect () {
		this.client = await MongoClient.connect('mongodb://localhost/sisgib', { useNewUrlParser: true })
		this.db = await this.client.db()
		return this.db
	}
}
