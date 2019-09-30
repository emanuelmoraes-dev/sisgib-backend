const { scape, toDate, getMinPattern, dateToStr, dateEquals, PERIODS, plus } = require('datetime-utility')
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

	const dataEmprestimoFilter = getWhereDateBySearch(search, 'dataEmprestimo')
	const dataDevolucaoFilter = getWhereDateBySearch(search, 'dataDevolucao')

	const find = {
		$or: [
			dataEmprestimoFilter || null,
			dataDevolucaoFilter || null,
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não'
				? { ativo: search.toLowerCase() === 'sim' ? 1 : 0 } : null,
			{ 'livro.titulo': searchRegex },
			searchNumber ? { 'livro.volume': searchNumber } : null,
			{ 'livro.categoria': searchRegex },
			{ 'livro.area': searchRegex },
			{ 'livro.idioma': searchRegex },
			searchNumber ? { 'livro.duracaoEmprestimo': searchNumber } : null,
			{ 'livro.editora': searchRegex },
			{ 'livro.autor': searchRegex }
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

	const dataEmprestimoFilter = getWhereDateBySearch(search, 'dataEmprestimo')
	const dataDevolucaoFilter = getWhereDateBySearch(search, 'dataDevolucao')

	const find = {
		$or: [
			dataEmprestimoFilter || null,
			dataDevolucaoFilter || null,
			search.toLowerCase() === 'sim' || search.toLowerCase() === 'não'
				? { ativo: search.toLowerCase() === 'sim' ? 1 : 0 } : null,
			{ 'livro.titulo': searchRegex },
			searchNumber ? { 'livro.volume': searchNumber } : null,
			{ 'livro.categoria': searchRegex },
			{ 'livro.area': searchRegex },
			{ 'livro.idioma': searchRegex },
			searchNumber ? { 'livro.duracaoEmprestimo': searchNumber } : null,
			{ 'livro.editora': searchRegex },
			{ 'livro.autor': searchRegex }
		]
	}

	find.$or = find.$or.filter(f => f !== null)

	res._content_ = await restful.query(find, Livro, {
		selectCount: true
	})
}, 200))

router.get('/defaultSearch/onlyActive', restful.execAsync(async (req, res, next) => {
	let { search, skip, limit, sort } = req.query
	const searchNumber = parseFloat(search)
	const searchRegex = new RegExp(`^${scape(search)}$`, 'i')
	skip = parseInt(skip)
	limit = parseInt(limit)

	const dataEmprestimoFilter = getWhereDateBySearch(search, 'dataEmprestimo')
	const dataDevolucaoFilter = getWhereDateBySearch(search, 'dataDevolucao')

	const find = {
		$or: [
			dataEmprestimoFilter || null,
			dataDevolucaoFilter || null,
			{ ativo: 1 },
			{ 'livro.titulo': searchRegex },
			searchNumber ? { 'livro.volume': searchNumber } : null,
			{ 'livro.categoria': searchRegex },
			{ 'livro.area': searchRegex },
			{ 'livro.idioma': searchRegex },
			searchNumber ? { 'livro.duracaoEmprestimo': searchNumber } : null,
			{ 'livro.editora': searchRegex },
			{ 'livro.autor': searchRegex }
		]
	}

	find.$or = find.$or.filter(f => f !== null)

	res._content_ = await restful.query(find, Livro, {
		skip, limit, sort
	})
}, 200))

router.get('/defaultSearch/onlyActive/count', restful.execAsync(async (req, res, next) => {
	const { search } = req.query
	const searchNumber = parseFloat(search)
	const searchRegex = new RegExp(`^${scape(search)}$`, 'i')

	const dataEmprestimoFilter = getWhereDateBySearch(search, 'dataEmprestimo')
	const dataDevolucaoFilter = getWhereDateBySearch(search, 'dataDevolucao')

	const find = {
		$or: [
			dataEmprestimoFilter || null,
			dataDevolucaoFilter || null,
			{ ativo: 1 },
			{ 'livro.titulo': searchRegex },
			searchNumber ? { 'livro.volume': searchNumber } : null,
			{ 'livro.categoria': searchRegex },
			{ 'livro.area': searchRegex },
			{ 'livro.idioma': searchRegex },
			searchNumber ? { 'livro.duracaoEmprestimo': searchNumber } : null,
			{ 'livro.editora': searchRegex },
			{ 'livro.autor': searchRegex }
		]
	}

	find.$or = find.$or.filter(f => f !== null)

	res._content_ = await restful.query(find, Livro, {
		selectCount: true
	})
}, 200))

function getWhereDateBySearch (search, attr) {
	const date = toDate(search, 'dd/MM/yyyy hh:mm:ss.z')

	if (!date)
		return null

	const pattern = getMinPattern(search, 'dd/MM/yyyy hh:mm:ss.z')

	const cmpDate1 = new Date(2019, 7, 7, 7, 7, 7, 7)
	const cmpDate2 = toDate(
		dateToStr(cmpDate1, pattern),
		pattern
	)

	let utilPeriod
	let utilPlus

	if (dateEquals(cmpDate1, cmpDate2)) {
		utilPeriod = PERIODS.MILLISECOND
		utilPlus = 0
	} else if (dateEquals(cmpDate1, cmpDate2, 6)) {
		utilPeriod = PERIODS.SECOND
		utilPlus = 1
	} else if (dateEquals(cmpDate1, cmpDate2, 5)) {
		utilPeriod = PERIODS.MINUTE
		utilPlus = 1
	} else if (dateEquals(cmpDate1, cmpDate2, 4)) {
		utilPeriod = PERIODS.HOUR
		utilPlus = 1
	} else if (dateEquals(cmpDate1, cmpDate2, 3)) {
		utilPeriod = PERIODS.DAY
		utilPlus = 1
	} else {
		utilPeriod = PERIODS.MONTH
		utilPlus = 1
	}

	if (utilPlus === 0)
		return {
			[attr]: date
		}

	const date2 = plus(date, utilPeriod, utilPlus)

	return {
		$and: [
			{ [attr]: { $gte: date } },
			{ [attr]: { $lt: date2 } }
		]
	}
}

module.exports = router
