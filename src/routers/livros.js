const { scape } = require('datetime-utility')
const express = require('express')
const router = express.Router()
const restful = require('../global/restful')
const { Livro } = require('../models')

router.get('/defaultSearch', restful.execAsync(async (req, res, next) => {
	let { search, skip, limit, sort } = req.query
	let searchNumber = parseFloat(search)
	let searchRegex = new RegExp(`^${scape(search)}$`, 'i')
	skip = parseInt(skip)
	limit = parseInt(limit)

	let find = {
		$or: [
			{ titulo: searchRegex },
			searchNumber ? { volume: searchNumber } : null,
			{ categoria: searchRegex },
			{ area: searchRegex },
			{ idioma: searchRegex },
			searchNumber ? { duracaoEmprestimo: searchNumber } : null,
			{ editora: searchRegex },
			{ autor: searchRegex },
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não' ?
				{ reservado: search.toLowerCase() === 'sim' ? 1 : 0 } : null
		]
	}

	find.$or = find.$or.filter(f !== null)

	res._content_ = await restful.query(find, Livro, {
		skip, limit, sort
	})

}, 200))

router.get('/defaultSearch/count', restful.execAsync(async (req, res, next) => {
	let { search } = req.query
	let searchNumber = parseFloat(search)
	let searchRegex = new RegExp(`^${scape(search)}$`, 'i')

	let find = {
		$or: [
			{ titulo: searchRegex },
			searchNumber ? { volume: searchNumber } : null,
			{ categoria: searchRegex },
			{ area: searchRegex },
			{ idioma: searchRegex },
			searchNumber ? { duracaoEmprestimo: searchNumber } : null,
			{ editora: searchRegex },
			{ autor: searchRegex },
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não' ?
				{ reservado: search.toLowerCase() === 'sim' ? 1 : 0 } : null
		]
	}

	find.$or = find.$or.filter(f !== null)

	res._content_ = await restful.query(find, Livro, {
		selectCount: true
	})

}, 200))

module.exports = router
