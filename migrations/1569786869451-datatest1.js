
const MongoConnect = require('../mongodb-connect')
const ObjectId = require('mongoose').Types.ObjectId

module.exports.up = async function () {
	const conn = new MongoConnect()

	return conn.connect().then(async db => {
		const Aluno = db.collection('alunos')
		const Livro = db.collection('livros')

		const salvarAluno = Aluno.insertOne({
			_id: ObjectId('5d91133afb2c221bdceeefe3'),
			nome: 'Emanuel Moraes de Almeida',
			email: 'emanuelmoraes297@gmail.com',
			matricula: '20151135000092',
			senha: '123'
		})

		const salvarLivros = Livro.insertMany([
			{
				_id: ObjectId('5d91133afb2c221bdceeefe4'),
				titulo: 'MongoDB: Construa novas aplicações com novas tecnologias',
				volume: 1,
				categoria: 'MongoDB',
				area: 'Computação',
				idioma: 'Português',
				editora: 'Casa do Código',
				autor: 'Fernando Boaglio'
			},
			{
				_id: ObjectId('5d91133afb2c221bdceeefe5'),
				titulo: 'Computer Network: A Top-Down Approach',
				volume: 6,
				categoria: 'Redes de Computadores',
				area: 'Computação',
				idioma: 'Inglês',
				editora: 'pearson',
				autor: 'James F. Kurose, Keith W. Ross'
			},
			{
				_id: ObjectId('5d91133afb2c221bdceeefe6'),
				titulo: 'Rede de Computadores: Uma Abordagem Top-Down',
				volume: 6,
				categoria: 'Redes de Computadores',
				area: 'Computação',
				idioma: 'Português',
				editora: 'pearson',
				autor: 'James F. Kurose, Keith W. Ross'
			}
		])

		await salvarAluno
		await salvarLivros
	}).finally(() => {
		if (!conn.client) return

		if (conn.client.isConnected())
			conn.client.close()
	})
}

module.exports.down = async function () {
	const conn = new MongoConnect()

	return conn.connect().then(async db => {
		const Aluno = db.collection('alunos')
		const Livro = db.collection('livros')

		const removerAluno = Aluno.deleteOne({
			_id: ObjectId('5d91133afb2c221bdceeefe3')
		})

		const removerLivros = Livro.deleteMany({
			$or: [
				{
					_id: ObjectId('5d91133afb2c221bdceeefe4')
				},
				{
					_id: ObjectId('5d91133afb2c221bdceeefe5')
				},
				{
					_id: ObjectId('5d91133afb2c221bdceeefe6')
				}
			]
		})

		await removerAluno
		await removerLivros
	}).finally(() => {
		if (!conn.client) return

		if (conn.client.isConnected())
			conn.client.close()
	})
}
