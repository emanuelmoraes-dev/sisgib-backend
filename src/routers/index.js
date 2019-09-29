const express = require('express')
const router = express.Router()
const livros = require('./livros')
const emprestimos = require('./emprestimos')

router.use('/livros', livros)
router.use('/emprestimos', emprestimos)

module.exports = router
