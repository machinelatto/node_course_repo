const path = require('path');

const express = require('express');
const bodyParser = require('body-parser'); // serve para pegar informações da pág e parsear

// "inicia" aaplicação
const app = express();

// configura a engine para renderizar coisas dinamicamente
app.set('view engine', 'ejs')
app.set('views', 'views')

// importa as rotas
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const notFoundController = require('./controllers/404error')

// adiciona um parser
app.use(bodyParser.urlencoded({extended: false}));
// adiciona arquivos estáticos para que possam ser acessados (neste caso css files)
app.use(express.static(path.join(__dirname, 'public')));

// usa as rotas importadas
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// no caso de não entrar em nenhuma rota válida redireciona para uma pagina de erro 404
app.use(notFoundController.getNotFound);

// server.listen()
// registra um listener no loop do node
app.listen(8080);
