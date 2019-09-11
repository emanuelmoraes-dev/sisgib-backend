const { Entity } =  require('alpha-restful')
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

		aluno: { id: ObjectId },

		livro: {
			id: ObjectId,
			titulo: { type: String, required: true },
			volume: { type: String, required: true },
			categoria: { type: String, required: true },
			autor: {
				id: ObjectId,
				nome: { type: String, required: true }
			},
			area: { type: String, required: true },
			editora: {
				id: ObjectId,
				nome: { type: String, required: true }
			},
			idioma: { type: String, required: true },
			duracaoEmprestimo: { type: Number, default: 15 }
		}
	},
	sync: {
		aluno: 'Aluno',

		livro: {
			name: 'Livro',

			sync: {
				autor: 'Autor',
				editora: 'Editora'
			}
		}
	}
})

restful.add(Emprestimo)

module.exports = Emprestimo