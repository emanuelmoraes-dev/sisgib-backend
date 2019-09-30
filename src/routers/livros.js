const { scape } = require('datetime-utility')
const express = require('express')
const router = express.Router()
const restful = require('../global/restful')
const { Livro } = require('../models')

router.get('/defaultSearch', restful.execAsync(async (req, res, next) => {
	let { search, skip, limit, sort } = req.query
	const searchNumber = parseFloat(search)
	const searchRegex = new RegExp(`^${scape(search)}$`, 'i')
	skip = parseInt(skip)
	limit = parseInt(limit)

	const find = {
		$or: [
			{ titulo: searchRegex },
			searchNumber ? { volume: searchNumber } : null,
			{ categoria: searchRegex },
			{ area: searchRegex },
			{ idioma: searchRegex },
			searchNumber ? { duracaoEmprestimo: searchNumber } : null,
			{ editora: searchRegex },
			{ autor: searchRegex },
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não'
				? { reservado: search.toLowerCase() === 'sim' ? 1 : 0 } : null
		]
	}

	find.$or = find.$or.filter(f => f !== null)

	res._content_ = await restful.query(find, Livro, {
		skip, limit, sort
	})
}, 200))

router.get('/defaultSearch/count', restful.execAsync(async (req, res, next) => {
	const { search } = req.query
	const searchNumber = parseFloat(search)
	const searchRegex = new RegExp(`^${scape(search)}$`, 'i')

	const find = {
		$or: [
			{ titulo: searchRegex },
			searchNumber ? { volume: searchNumber } : null,
			{ categoria: searchRegex },
			{ area: searchRegex },
			{ idioma: searchRegex },
			searchNumber ? { duracaoEmprestimo: searchNumber } : null,
			{ editora: searchRegex },
			{ autor: searchRegex },
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não'
				? { reservado: search.toLowerCase() === 'sim' ? 1 : 0 } : null
		]
	}

	find.$or = find.$or.filter(f => f !== null)

	res._content_ = await restful.query(find, Livro, {
		selectCount: true
	})
}, 200))

module.exports = router
