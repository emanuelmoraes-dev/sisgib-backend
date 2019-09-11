const { Entity } =  require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Autor = new Entity({
	name: 'Autor',
	resource: 'autores',
	methods: ['get'],
	descriptor: {
		nome: { type: String, required: true }
	},
	sync: {
		livros: {
			name: 'Livro',
			syncronized: ['autor'],
			jsonIgnore: true
		}
	}
})

restful.add(Autor)

module.exports = Autor