import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar'
import { makeStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import SignUp from './signUp.js'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import PropTypes from 'prop-types';
import LogIn from './LogIn.js';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Container, Card } from '@material-ui/core';

const phash = require('password-hash')
const sha1 = require('sha1')
const styles = theme => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    title: {
      color: red
    },
    menuButton: {
      color: red
    },
    signup: {
      
    },
    divider: {
        margin: theme.spacing(2, 2, 2),
        padding: theme.spacing(2, 2, 2),
        // color: 'blue'
        // backgroundColor: '#e8e2d3',
        // background: 'linear-gradient(45deg, #CE0B80 30%, #FF8E53 90%)'
    },
    card: {
        background: 'linear-gradient(90deg, #02acbf 30%, #046c78 90%)'
    }
    // toolbar: {
    //   display: 'flex',
    //   alignItems: 'center',
    //   flexDirection: 'row',
    //   justifyContent: 'spaceAround'
    // }
  });


  class Vendor extends Component{
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    }
    constructor(props){
        super(props)
        const { cookies } = props
        console.log(cookies.get('loggedIn'))
        this.state = {
            showMyComponent: false,
            loggedIn: cookies.get('loggedIn'),
            customer: cookies.get('customer'),
            vendor: cookies.get('vendor'),
            productName: '',
            bundlePrice: 0,
            bundleQuantity: 0,
            userId: cookies.get('user'),
            data: '',
            products: []
        }
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        // this.onChangePassword = this.onChangePassword.bind(this);
        this.logOut = this.logOut.bind(this)
        this.showForm = this.showForm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.fetchProducts = this.fetchProducts.bind(this)
        this.showProducts = this.showProducts.bind(this)
        this.removeProduct = this.removeProduct.bind(this)
    }
    removeProduct(productName){
        const {cookies} = this.props
        const product = {
            productName: productName,
            userId: cookies.get('user')
        }
        var post = axios.post('http://localhost:4000/removeProduct', product)
        .then(res => {
            console.log(res.data)
            window.location.reload()
        })
    }
    componentDidMount(){
        this.fetchProducts()
        .then(res => {
            // this.setState({
            //     data: res.body,
            // })
        })
        .catch(err => console.log(err))
        // this.showProducts()
        // console.log(this.products)
    }
    showProducts() {
        const {classes} = this.props
        let products = []
    
        // Outer loop to create parent
        for (let i = 0; i < this.state.data.length; i++) {
          //Inner loop to create children
            products.push(
            <Grid item xs={5} className={classes.divider}>
                <Card className={classes.root, classes.card}>
                    <CardContent>
                        {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {this.state.data[i].productName}
                        </Typography> */}
                        <Typography variant="h5" component="h2">
                            {this.state.data[i].productName}
                        </Typography>
                        {/* <Typography className={classes.pos} color="textSecondary">
                        adjective
                        </Typography> */}
                        <Typography variant="body2" component="p">
                            Bundle Price: {this.state.data[i].bundlePrice}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Bundle Quantity: {this.state.data[i].bundleQuantity}
                        </Typography>
                        {/* <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                        </Typography> */}
                    </CardContent>
                    <CardActions>
                        <Button size="small" style={{color: "red"}} onClick = {() => {this.removeProduct((this.state.data[i].productName))}}>Remove</Button>
                    </CardActions>
                </Card>
            </Grid>
            )
        }
        console.log(products)
        this.setState({
            products: products
        })
        // console.log('hello')
        // console.log(this.state.products)
        return products
      }
    
    fetchProducts = async() => {
        const {cookies} = this.props
        const product = {
            userId: cookies.get('user')
        }
        var post = axios.post('http://localhost:4000/products', product)
        .then(res => {
            console.log(res.data.length)
            this.setState({
                data: res.data
            })
        })
        this.showProducts()
        return 
    }

    onChangeProductName(event) {
        this.setState({ productName: event.target.value });
    }
    onChangePrice(event) {
        this.setState({ bundlePrice: event.target.value });
    }
    onChangeQuantity(event) {
        this.setState({ bundleQuantity: event.target.value });
    }
  
    showForm(){
        if(this.state.showMyComponent == true){
            this.setState({
                showMyComponent: false,
            })
        }
        else{
            this.setState({
                showMyComponent: true
            })
        }
    }
    logOut(){
        const {cookies} = this.props
        cookies.remove('user')
        cookies.remove('loggedIn')
        cookies.remove('customer')
        cookies.remove('vendor')
        // this.props.history.push('/')
        window.location.reload()
    }
    onSubmit(e) {
        e.preventDefault();
        const {cookies} = this.props
        const newProduct = {
            userId: this.state.userId,
            productName: this.state.productName,
            bundlePrice: this.state.bundlePrice,
            // passwordHash: sha1(this.state.password+'secret'),
            bundleQuantity: this.state.bundleQuantity,
            // type: this.state.type
        }
        if(newProduct['productName'] !== '' && newProduct['bundlePrice'] != 0 && newProduct['bundleQuantity'] != 0)
        {
          this.setState({
            error: ''
          })
          axios.post('http://localhost:4000/addProduct', newProduct)
            .then(res => {
                console.log(res.data)
                this.setState({
                    error: res.data,
                })
            //   if(res.data == 'user added'){
            //     cookies.set('loggedIn', true)
            //     if(this.state.type == 'customer'){
            //       cookies.set('customer', true)
            //       cookies.set('vendor', false)
            //     }
            //     else{
            //       cookies.set('customer', false)
            //       cookies.set('vendor', true)
            //     }
            //     this.props.history.push('/')
            //     window.location.reload()
            //   }
            });
            this.setState({
                productName: '',
                bundlePrice: 0,
                bundleQuantity: 0,
            });
            window.location.reload()
        }
        else
        {
          this.setState({
            error: '*Please fill all mandatory fields'
          })
          this.setState({
              productName: this.state.productName,
              bundlePrice: 0,
              bundleQuantity: 0,
          });
        }
    
    }
    render(){
        const {classes} = this.props
        const bull = <span className={classes.bullet}>•</span>;
        return(
            <Container>
                <AppBar position="static">
                    <Toolbar>
                    {/* <IconButton edge="start" color="red" aria-label="menu">
                        <MenuIcon /> */}
                    {/* </IconButton> */}
                    <Typography variant="h6" className={classes.title} style={{flex: 1}}>
                        Home
                    </Typography>
                    <Link>
                        <Button color="black" className='float-right' onClick = {this.showForm}>ADD NEW PRODUCT</Button>
                    </Link>
                    <Link>
                        <Button color="inherit" className='float-right' onClick = {this.logOut}>Sign Out</Button>
                    </Link>
                    </Toolbar>
                </AppBar>
                <div style={this.state.showMyComponent ? {} : { display: 'none' }}>
                    <form className={classes.form} Validate>
                        <Grid container spacing={3} alignItems="center" justify="space-around">
                            <Grid item>
                                <TextField
                                    // error = "false"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="productName"
                                    label="Product Name"
                                    name="productName"
                                    autoComplete="productName"
                                    onChange = {this.onChangeProductName}
                                    value = {this.state.productName}
                                />
                            </Grid>
                            <Grid item >
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="bundlePrice"
                                    label="Bundle Price"
                                    type="number"
                                    id="bundlePrice"
                                    autoComplete="bundlePrice"
                                    onChange = {this.onChangePrice}
                                    value = {this.state.bundlePrice}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type="number"
                                    id="bundleQuantity"
                                    label="Bundle Quantity"
                                    name="bundleQuantity"
                                    autoComplete="bundleQuantity"
                                    onChange = {this.onChangeQuantity}
                                    value = {this.state.bundleQuantity}
                                />
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justify="center">
                            <Button
                                alignItems="center"
                                type="submit"
                                // fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick = {this.onSubmit}
                            >
                                Add Product
                            </Button>
                        </Grid>
                        <div fullWidth style={{color: "red"}}>{this.state.error}</div>
                        {/* <Grid container justify="flex-end">
                            <Grid item>
                            <Link to='/register'>
                                <Button onClick = {this.goToRegister}>Don't have an account? Register here</Button>
                            </Link>
                            </Grid>
                        </Grid> */}
                        </form>
                </div>
                <div className = {classes.divider}>
                    <Typography>YOUR PRODUCTS</Typography>
                    <hr size="5" style={{color: 'black', display: 'block', backgroundColor: 'black'}}></hr>
                </div>
                <div>
                    <Grid container spacing={3} alignItems="center" justify="center">
                        {this.state.products}
                        {/* {this.showProducts()} */}
                    </Grid>
                    {/* <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                            Word of the Day
                            </Typography>
                            <Typography variant="h5" component="h2">
                            be{bull}nev{bull}o{bull}lent
                            </Typography>
                            <Typography className={classes.pos} color="textSecondary">
                            adjective
                            </Typography>
                            <Typography variant="body2" component="p">
                            well meaning and kindly.
                            <br />
                            {'"a benevolent smile"'}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions>
                    </Card> */}
                </div>
            </Container>
        )
    }
  }
  export default withCookies(withStyles(styles)(Vendor));