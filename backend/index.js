const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const port = process.env.PORT || 4000;
const cors = require('cors')
const routes = express.Router()

let User = require('./models/user')
let Product = require('./models/product')
let Login = require('./models/login')
let Query = require('./models/query')
let Remover = require('./models/removeProduct')
let Searcher = require('./models/searchProduct')
let Order = require('./models/order')
app.use(cors()) 
app.use(bodyParser.json())

var mongodb = "mongodb://127.0.0.1:27017/temp"
mongoose.Promise = global.Promise
mongoose.connect(mongodb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false})
var connection = mongoose.connection
connection.once('open', function() {
    console.log("MongoDB database connection established succesfully.");
})
connection.on('error', console.error.bind(console, "MongoDB connection error"))

routes.route('/').get(function(req, res){
    // res.send('hello world')
    res.sendFile(__dirname + '/index.html')
    console.log('hello world')
})

routes.route('/users').get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

routes.route('/allProducts').get(function(req, res) {
    console.log('fetching products')
    console.log(req.body.userId)
    // let query = Query(req.body)
    Query.find( function(err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log('sending response')
            // console.log(users)
            res.json(users);
        }
    });
});

routes.route('/searchProducts').post(function(req, res) {
    console.log('fetching products')
    console.log(req.body.productName)
    console.log(req.body.filter)
    // let query = Query(req.body)
    // if(req.body.filter === 'itemsLeft')
    const {name, filter} = req.body
    if(req.body.productName === ''){
        console.log('all')
            Query.find({'readyToDispatch': false, 'dispatched': false}, null, {sort: req.body.filter}, function(err, users) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('sending response')
                    console.log(users)
                    res.json(users);
                }
            });
    }
    else{
        Searcher.find({'productName': req.body.productName, 'readyToDispatch': false, 'dispatched': false}, null, {sort: req.body.filter},     function(err, products) {
            if (err) {
                console.log(err);
            } else {
                console.log('sending response')
                // console.log(products)
                res.json(products);
            }
        });
    }
});

routes.route('/getOrders').post(function(req, res) {
    var placedOrder = []
    console.log(req.body)
    const {user, productName, filter} = req.body
    console.log('getting orders')
    console.log(req.body.userId)
    var status = ''
    if(req.body.productName === ''){
        console.log('all')
            Order.find({'userId': req.body.userId}, null, {sort: req.body.filter}, function(err, orders) {
                if (err) {
                    console.log(err);
                } else {
                    // console.log('sending respo')
                    // // console.log(orders)
                    for(let i = 0; i<orders.length; i++){
                    //     console.log(orders[i].productId)
                    //     // console.log(orders[i].userId)
                        Product.findOne({'_id': orders[i].productId}, '', function(err, product){
                    //         if(err){
                    //             console.log(err)
                    //         }
                    //         else{
                                // console.log(product)
                            if(product){
                                orders[i].set('itemsLeft', product.itemsLeft)
                                if(product.itemsLeft > 0){
                                    status = 'waiting'
                                }
                                else{
                                    if(product.readyToDispatch == true){
                                        status = 'placed'
                                    }
                                    else{
                                        status = 'dispatched'
                                    }
                                }
                                const order = {
                                    'userId': orders[i].userId,
                                    'productId': orders[i].productId,
                                    'productName': orders[i].productName,
                                    'itemsLeft': product.itemsLeft,
                                    'itemQuantity': orders[i].itemQuantity,
                                    'status': status
                                }
                                // console.log(order)
                                placedOrder.push(order)
                                // console.log(placedOrder)
                            }
                            else{
                                const order = {
                                    'userId': orders[i].userId,
                                    'productId': orders[i].productId,
                                    'productName': orders[i].productName,
                                    'itemsLeft': -1,
                                    'itemQuantity': orders[i].itemQuantity,
                                    'status': 'canceled'
                                } 
                            }
                            if(i==orders.length -1 ){
                                console.log(placedOrder)
                                res.send(placedOrder);
                            }
                    //         }
                        })
                        // console.log(orders[i].itemsLeft)
                    }
                }
            });
    }
    else{
        Order.find({'userId': req.body.userId, 'productName': req.body.productName}, null, {sort: req.body.filter},     function(err, orders) {
            if (err) {
                console.log(err);
            } else {
                console.log('sending response')
                // console.log(products)
                res.json(orders);
            }
        });
    }
});

routes.route('/products').post(function(req, res) {
    console.log('fetching products')
    console.log(req.body.userId)
    let query = Query(req.body)
    Query.find({'userId': req.body.userId, 'readyToDispatch': false, 'dispatched': false},'productName bundleQuantity bundlePrice itemsLeft', function(err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log('sending response')
            console.log(users)
            res.json(users);
        }
    });
});

routes.route('/readyProducts').post(function(req, res) {
    console.log('fetching products')
    console.log(req.body.userId)
    let query = Query(req.body)
    Query.find({'userId': req.body.userId, 'readyToDispatch': true, 'dispatched': false},'productName bundleQuantity bundlePrice itemsLeft', function(err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log('sending response')
            console.log(users)
            res.json(users);
        }
    });
});

routes.route('/placeOrder').post(function(req, res) {
    console.log('placing order')
    // console.log(req.body.userId)
    itemsLeft = req.body.itemsLeft
    let order = Order(req.body)
    if(itemsLeft == 0){
        Product.findByIdAndUpdate({'_id': req.body.productId}, {'itemsLeft': itemsLeft, readyToDispatch: true}, function(err, product){
            if(err){
                console.log(err)
            }
            else{
                // console.log(product)
            }
        })
        order.save()
        .then(res => {
                console.log('order placed')
                console.log(res)
        });
    }
    else{
        Product.findByIdAndUpdate({'_id': req.body.productId}, {'itemsLeft': itemsLeft}, function(err, product){
            if(err){
                console.log(err)
            }
            else{
                // console.log(product)
            }
        })
        order.save()
        .then(res => {
                console.log('order placed')
                console.log(res)
        });
    }
})

routes.route('/removeProduct').post(function(req, res) {
    console.log('fetching products')
    console.log(req.body.userId)
    let query = Remover(req.body)
    Remover.deleteOne({'userId': req.body.userId, 'productName': req.body.productName}, function(err, users) {
        if (err) {
            console.log(err);
        } else {
            console.log('sending response')
            console.log(users)
            res.json(users);
        }
    });
});

routes.route("/signup").post(function(req, res) {
    console.log('why it')
    console.log(req.body)
    let user = new User(req.body);
    User.findOne({'email': req.body.email}, 'email', function(err, person){
        if(err) return handleError(err);
        if (person){
            console.log('email already exists')
            res.status(200).send('Email address already registered')
        }
        else{
            console.log('success')
            user.save()
            .then(item => {
                res.set('Content-Type', 'text/plain')
                res.status(200).send('user added');
            })
            // .catch(err => {
            //     res.status(400).send('Error');
            // });
            // res.redirect('/')           
        }
    })
});

routes.route("/addProduct").post(function(req, res) {
    console.log('adding product')
    console.log(req.body)
    let product = new Product(req.body);
    Product.findOne({'productName': req.body.productName, 'userId': req.body.userId}, 'productName', function(err, prod){
        if(err) return handleError(err);
        // if (prod){
        //     console.log('Product already exists')
        //     res.status(200).send('Product already added')
        // }
        // else{
            console.log('success')
            product.save()
            .then(item => {
                res.set('Content-Type', 'text/plain')
                res.status(200).send('product added');
            })
            // .catch(err => {
            //     res.status(400).send('Error');
            // });
            // res.redirect('/')           
        // }
    })
});

routes.route("/login").post(function(req, res){
    console.log("logging in")
    let user = Login(req.body)
    console.log(req.body.email)
    console.log(req.body.password)
    console.log(req.body.passwordHash)
    Login.findOne({'email': req.body.email, 'passwordHash': req.body.passwordHash}, '_id firstName type', function(err, person){
        console.log('querying db')
        console.log(person)
        if(err) return handleError(err);
        if(person){
            console.log('valid user')
            res.status(200).json(person)
        }
        else{
            console.log('user not found')
            // res.set('Content-Type', 'json')
            res.status(200).json({"firstName": "Invalid Credentials"})
        }
    })
})
// app.use(bodyParser.urlencoded({extended: true}))
app.use('/', routes)
app.listen(port, function(){
	console.log('on port 4000')
})