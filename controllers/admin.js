const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    //  envia o arquivo html ou ejs
    // com a página add-product
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    
    const product = new Product(title, imageUrl, description, price)
    
    product.save()
    // quando recebe uma requisição POST para /add-product redireciona para a raiz
    res.redirect('/');
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    
    res.render('admin/edit-product',{
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode
    })
}



exports.getProducts = (req, res, next) => {
    Product.fetchAll((products)=> {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
          })    
    })
}
