const { Entity } = require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Emprestimo = new Entity({
	name: 'Emprestimo',
	resource: 'emprestimos',
	methods: ['get'],
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

restful.add(Emprestimo)

module.exports = Emprestimo
