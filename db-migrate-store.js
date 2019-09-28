const MongoConnect = require('./mongodb-connect')

module.exports = class dbStore {
	constructor () {
		this.conn = new MongoConnect()
	}

	load (fn) {
		return this.conn.connect().then(async db => {
			const migrations = db.collection('migrations')
			const data = await migrations.find().toArray()
			if (!data.length) return {}
			const store = data[0]

			if (!Object.prototype.hasOwnProperty.call(store, 'lastRun') ||
            !Object.prototype.hasOwnProperty.call(store, 'migrations'))
				throw new Error('Invalid store file')

			return store
		}).then(data => fn(null, data)).catch(err => fn(err)).finally(() => {
			if (!this.conn.client)
				return

			if (this.conn.client.isConnected())
				this.conn.client.close()
		})
	}

	save (set, fn) {
		return this.conn.connect().then(async db => {
			const migrations = db.collection('migrations')
			return migrations.updateMany({}, {
				$set: {
					lastRun: set.lastRun,
					migrations: set.migrations
				}
			}, { upsert: true })
		}).then(result => fn(null, result)).catch(err => fn(err)).finally(() => {
			if (!this.conn.client)
				return

			if (this.conn.client.isConnected())
				this.conn.client.close()
		})
	}
}
