import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';

import {engine} from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './utils.js';
import { viewsRoute } from './routes/views.route.js';
import productRoute  from './routes/products.route.js';
import cartRoute  from './routes/carts.route.js';
import sessionRoute from './routes/sessions.route.js';
import initializePassport from './config/passport.config.js';
import { userRouter } from './routes/user.route.js';
import { swaggerSpecs } from './config/docConfig.js';
import swaggerUi from 'swagger-ui-express';




const MONGO = 'mongodb+srv://magabrielavercelli:AitYC66JzKrHxPUN@cluster0.azjq6df.mongodb.net/Ecommerce';

mongoose.connect(MONGO)
    .then(() => {
        console.log('Conexión a MongoDB exitosa');
    })
    .catch(err => console.error('Error al conectar a MongoDB:', err));


const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname + '/public'));


initializePassport()

app.use(session({
    store: new MongoStore({
        mongoUrl: MONGO,
        ttl: 3600
    }),
    secret: 'CoderSecret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

app.use('/', viewsRoute);
app.use('/api/sessions', sessionRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('api/users', userRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


const httpServer = app.listen(PORT, () => console.log (`Servidor funcionando en el puerto: ${PORT}`))



const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) =>{
    console.log('Nuevo cliente conectado');

    const products = await productManager.getProducts();
   
    socket.emit('products', {product: products});
})