const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

module.exports = class MongoDbConnect {
	async connect () {
		this.client = await MongoClient.connect('mongodb+srv://ltt-user:KXCuf!3H!2BpJ5X@dbt-oihro.mongodb.net/sisgib?retryWrites=true&w=majority', { useNewUrlParser: true })
		this.db = await this.client.db()
		return this.db
	}
}
