const { Entity } = require('alpha-restful')
const restful = require('../global/restful')

const Livro = new Entity({
	name: 'Livro',
	resource: 'livros',
	methods: ['get'],
	descriptor: {
		titulo: { type: String, required: true },
		volume: { type: Number, required: true },
		categoria: { type: String, required: true },
		area: { type: String, required: true },
		idioma: { type: String, required: true },
		duracaoEmprestimo: { type: Number, default: 15 },
		editora: { type: String, required: true },
		autor: { type: String, required: true },
		reservado: { type: Boolean, default: false }
	},
	sync: {
		emprestimos: {
			name: 'Emprestimo',
			syncronized: ['livro'],
			jsonIgnore: true
		}
	}
})

restful.add(Livro)

module.exports = Livro
