const { Entity } = require('alpha-restful')
const restful = require('../global/restful')

const Aluno = new Entity({
	name: 'Aluno',
	resource: 'alunos',
	methods: ['get'],
	descriptor: {
		nome: { type: String, required: true },
		email: { type: String, unique: true },
		matricula: { type: String, unique: true, required: true },
		senha: { type: String, required: true },
		inicioPenalizacao: { type: Date },
		duracaoPenalizacao: { type: Number }
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
