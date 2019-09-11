const { Entity } =  require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Editora = new Entity({
	name: 'Editora',
	resource: 'editoras',
	methods: ['get'],
	descriptor: {
		nome: { type: String, required: true }
	},
	sync: {
		livros: {
			name: 'Livro',
			syncronized: ['editora']
		}
	}
})

restful.add(Editora)

module.exports = Editora