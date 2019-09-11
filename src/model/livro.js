const { Entity } =  require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Livro = new Entity({
	name: 'Livro',
	resource: 'livros',
	methods: ['get'],
	descriptor: {
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
	},
	sync: {
		autor: 'Autor',
		editora: 'Editora',
		emprestimos: {
			name: 'Emprestimo',
			syncronized: ['livro'],
			jsonIgnore: true
		}
	},
	projectionDefault: 'default',
	projections: {
		default (livro, resolve, reject) {
			try {
				livro.autor = livro.autor.nome
				livro.editora = livro.editora.nome
				resolve(livro)
			} catch (err) {
				reject(err)
			}
		}
	}
})

restful.add(Livro)

module.exports = Livro