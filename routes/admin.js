// import para funções que manipulam path para achar os arquivos corretos
const path = require('path'); 

// framework para trabalhar com middleware
// facilita muito a logica das routes e manipulação de dados e arquivos
const express = require('express');

// importa as funções controller
const adminController = require('../controllers/admin')

const router = express.Router();


// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct)

router.get('/products', adminController.getProducts)

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct)

module.exports = router;

