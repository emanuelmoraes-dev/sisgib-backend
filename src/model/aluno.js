const { Entity } =  require('alpha-restful')
const restful = require('../global/restful')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const Aluno = new Entity({
	name: 'Aluno',
	resource: 'alunos',
	methods: ['get'],
	descriptor: {
		nome: { type: String, requried: true },
		matricula: { type: String, requried: true },
		senha: { type: String, required: true }
	},
	sync: {
		emprestimos: {
			name: 'Emprestimo',
			syncronized: ['aluno'],
			jsonIgnore: true
		}
	}
})

restful.add(Aluno)

module.exports = Aluno