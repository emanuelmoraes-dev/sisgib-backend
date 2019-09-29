const express = require('express')
const router = express.Router()
const jwt = require('jwt-then')
const cors = require('cors')

const internalLogin = 'e072dcc5-d2aa-4e87-ac2e-80c1af8305f2'
const internalPassword = '6fdd7070-cc8b-43f6-8e42-fc9ed0eea5cc'

const ACCESS_SECRET = '8eede637-6362-4231-aef7-6e9f33aa1496'
const REFRESH_SECRET = 'a86bd99a-036c-48c3-b741-255f4c95d2f7'

const EXPIRES_ACCESS = 10*24*60*60 // 10 dias
const EXPIRES_REFRESH = 60 // 60 segundos

router.use(cors({
	origin: 'http://localhost:8080',
	credentials: true
}))

router.post('/login', (req, res, next) => {
	var f = {
		email: req.body.user,
		password: req.body.pwd
	}

	if (f.email === internalLogin && f.password === internalPassword) {
		jwt.sign({ user: {} }, ACCESS_SECRET, {
			expiresIn: EXPIRES_ACCESS
		}).then(function (access_token) {
			res.status(200).cookie('x-access-token', access_token).send({ access_token })
		}).catch(function (err) {
			next(err)
		})
	} else {
		next({ status: 401, message: 'Login inválido!' })
	}
})

router.post('/auth', (req, res, next) => {
	let access_token = req.cookies['x-access-token']
	if (!access_token) return next({ status: 400, message: 'No access token provided.' })

	let user

	jwt.verify(access_token, ACCESS_SECRET)
		.catch(function (err) {
			next({ status: 401, message: 'Failed to authenticate access token.' })
		})
		.then(function (decoded) {

			user = decoded.user

			return jwt.sign({ user }, ACCESS_SECRET, {
				expiresIn: EXPIRES_ACCESS
			})
		})
		.then(function (access_token) {

			res.status(204).cookie('x-access-token', access_token)

			return jwt.sign({ user }, REFRESH_SECRET, {
				expiresIn: EXPIRES_REFRESH
			})
		})
		.then(function (refresh_token) {
			res.status(200).send({ refresh_token })
		})
		.catch(function (err) {
			next(err)
		})
})

function verifyToken(req, res, next) {

	let access_token = req.cookies['x-access-token']
	let refresh_token = req.headers['x-refresh-token']

	if (!access_token) return next({ status: 400, message: 'No access token provided.' })
	if (!refresh_token) return next({ status: 400, message: 'No refresh token provided.' })

	jwt.verify(access_token, ACCESS_SECRET)
		.catch(function (err) {
			next({ status: 401, message: 'Failed to authenticate access token.' })
		})
		.then(function (decoded) {
			return jwt.verify(refresh_token, REFRESH_SECRET)
		})
		.then(function (decoded) {
			// se tudo estiver ok, salva no request para uso posterior
			req.user = decoded.user
			next()
		})
		.catch(function (err) {
			next({ status: 401, message: 'Failed to authenticate refresh token.' })
		})
}

router.use(verifyToken)

module.exports = router
