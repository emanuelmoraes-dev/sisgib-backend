const { plus, PERIODS } = require('datetime-utility')
const { Entity } = require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Emprestimo = new Entity({
	name: 'Emprestimo',
	resource: 'emprestimos',
	methods: ['get', 'post', 'patch'],
	descriptor: {
		dataEmprestimo: { type: Date, required: true },
		dataDevolucao: { type: Date, required: true },
		ativo: { type: Boolean, default: true },
		aluno: { id: ObjectId },

		livro: {
			id: ObjectId,
			titulo: { type: String, required: true },
			volume: { type: Number, required: true },
			categoria: { type: String, required: true },
			area: { type: String, required: true },
			idioma: { type: String, required: true },
			editora: { type: String, required: true },
			autor: { type: String, required: true }
		}
	},
	sync: {
		aluno: 'Aluno',
		livro: 'Livro'
	}
})

Emprestimo.beforeCreate = async (emprestimo, req, res, next) => {
	const { Livro } = restful.entities

	emprestimo.dataEmprestimo = new Date()
	emprestimo.dataDevolucao = plus(emprestimo.dataEmprestimo, PERIODS.DAY, req.body.livro.duracaoEmprestimo)
	emprestimo.ativo = true

	await Livro.model.updateOne({ _id: emprestimo.livro.id }, { $set: { reservado: true } })
	next()
}

Emprestimo.beforeEdit = async (emprestimo, req, res, next) => {
	const { Livro } = restful.entities
	const salved = await restful.query({ _id: req.body.id }, Emprestimo, { findOne: true })

	if (!emprestimo.ativo && salved.ativo) {
		await Livro.model.updateOne({ _id: emprestimo.livro.id }, { $set: { reservado: false } })
		emprestimo.dataDevolucao = new Date()
	}

	next()
}

restful.add(Emprestimo)

module.exports = Emprestimo
