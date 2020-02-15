const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const port = process.env.PORT || 4000;
const cors = require('cors')
const routes = express.Router()

let User = require('./models/user')
let Login = require('./models/login')
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
// Adding a new user
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

routes.route("/login").post(function(req, res){
    console.log("logging in")
    let user = Login(req.body)
    console.log(req.body.email)
    console.log(req.body.password)
    console.log(req.body.passwordHash)
    Login.findOne({'email': req.body.email, 'passwordHash': req.body.passwordHash}, 'firstName', function(err, person){
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

// app.get('/hello', function(req, res){
// 	res.send('Hello world')
// 	// res.sendFile(__dirname + '/index.html')
// 	console.log('home page')
// })
// app.post('/quotes', function(req, res){
// 	main(req, res).catch(console.error)
// })
// async function main(req, res){
//     // const uri = "mongodb+srv://dbuser:dbpassword@custandven-mjntd.mongodb.net/test?retryWrites=true&w=majority";
//     const uri = "mongodb://127.0.0.1:27017"
 

//     const client = new MongoClient(uri);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         console.log(client.db('temp'));
//         client.db('temp').collection('test').save(req.body);
//         res.redirect('/')
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }