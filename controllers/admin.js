const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    //  envia o arquivo html ou ejs
    // com a página add-product
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    
    const product = new Product(null, title, imageUrl, description, price)
    
    product.save()
    // quando recebe uma requisição POST para /add-product redireciona para a raiz
    res.redirect('/');
}


exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
      return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId,product => {
      if(!product){
        return res.redirect('/')
      }
      console.log(product)
      res.render('admin/edit-product',{
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      })
    })

}

exports.postEditProduct = (req,res,next) =>{
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImageUrl = req.body.imageUrl
  const updatedDesc = req.body.description
  const updatedProduct = new Product(prodId,updatedTitle, updatedImageUrl, updatedDesc, updatedPrice)
  updatedProduct.save()
  res.redirect('/admin/products')
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
