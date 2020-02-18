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
import ReactSearchBox from 'react-search-box'
import CardContent from '@material-ui/core/CardContent';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import MenuItem from '@material-ui/core/MenuItem';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import SortIcon from '@material-ui/icons/Sort';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Container, Card, Box } from '@material-ui/core';
import Product from './CustProduct.js'

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
    },
    card: {
        background: 'linear-gradient(90deg, #02acbf 30%, #046c78 90%)'
    }
  });


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Customer extends Component{
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
            data: [],
            searchText: '',
            products: [],
            filter: '',
            itemQuantity: 0,
            itemsLeft: 0
        }
        this.onChangeProductName = this.onChangeProductName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onChangeQuantity = this.onChangeQuantity.bind(this);
        this.onChangeItemQuantity = this.onChangeItemQuantity.bind(this);
        this.onChangeSearchText = this.onChangeSearchText.bind(this);
        // this.onChangePassword = this.onChangePassword.bind(this);
        this.logOut = this.logOut.bind(this)
        this.showForm = this.showForm.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.fetchProducts = this.fetchProducts.bind(this)
        this.createProducts = this.createProducts.bind(this)
        this.orderProduct = this.orderProduct.bind(this)
    }
    componentDidMount(){
        this.fetchProducts()
        .then(res => {
        })
        .catch(err => console.log(err))
    }
    
    createProducts(){
        if(this.state.searchText === ''){
            console.log(this.state.data)
            this.setState({
                products: this.state.data
            })
            console.log(this.state.products)
        }
        else{
            var p = []
            for(let i=0; i<this.state.data.length; i++){
                if(this.state.data[i].productName.toLowerCase().includes(this.state.searchText)){
                    p.push(this.state.data[i])
                }
            }
            this.setState({
                products: p
            })
        }
    }
    fetchProducts = async() => {
        const {cookies} = this.props
        console.log('hello')
        console.log(this.state.searchText)
        const product = {
            productName: this.state.searchText,
            filter: this.state.filter
        }
        var post = axios.post('http://localhost:4000/searchProducts', product)
        .then(res => {
            console.log(res.data.length)
            console.log(res.data)
            this.setState({
                data: res.data
            })
            console.log(this.state.data)
        })
        return 
    }

    orderProduct(productName, availabul, id){
        console.log("ahsdfjhasljkdhf", productName)
        const {cookies} = this.props
        console.log('wow')
        console.log(this.state[id])
        console.log(availabul)
        console.log(this.state.itemQuantity)
        if(this.state[id] > availabul){
            console.log('fjslfsj')
            this.setState({invalidOrder: true})
        }
        else{
            const order = {
                userId: cookies.get('user'),
                itemQuantity: this.state[id],
                itemsLeft: availabul - this.state[id],
                productId: id
            }
            axios.post('http://localhost:4000/placeOrder', order)
            .then(res => {
                console.log(res)
            })
            this.setState({order: true})
            this.fetchProducts()
            // window.location.reload()
        }
    }

    onChangeSearchText(event) {
        this.setState({ searchText: event.target.value });
    }
    onChangeFilter(event) {
        this.setState({ filter: event.target.value });
        console.log(this.state.filter)
    }
    onChangeProductName(event) {
        this.setState({ productName: event.target.value });
    }
    onChangePrice(event) {
        this.setState({ bundlePrice: event.target.value });
    }
    onChangeItemQuantity(event, id) {
        console.log(event.target.value)
        this.setState({ [id]: event.target.value }, () => {
            console.log(this.state)
        });
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
        window.location.reload()
    }
    onSubmit(e) {
        e.preventDefault();
        const {cookies} = this.props
        const newProduct = {
            userId: this.state.userId,
            productName: this.state.productName,
            bundlePrice: this.state.bundlePrice,
            bundleQuantity: this.state.bundleQuantity,
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
        const allProducts = this.state.data.map(product => <Product key = {product._id} item = {product} order = {this.orderProduct} onChangeItemQuantity = {this.onChangeItemQuantity}/>)
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                    <Typography variant="h6" className={classes.title} style={{flex: 1}}>
                        Home
                    </Typography>
                    <Link>
                        <Button color="inherit" className='float-right' onClick = {this.logOut}>Sign Out</Button>
                    </Link>
                    </Toolbar>
                </AppBar>
                <Container>
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
                        </form>
                </div>
                <div className = {classes.divider}>
                    <Box display="flex" flex="row" alignItems="center" justifyContent="space-between">
                        <Typography>All PRODUCTS</Typography>
                        <Box width="60%" display="flex" flexDirection="row" alignItems="center" justifyContent="space-around">
                            <TextField
                                style={{width: '60%'}}
                                required
                                type="text"
                                id="searchText"
                                name="searchText"
                                autoComplete="searchText"
                                onChange = {this.onChangeSearchText}
                                value = {this.state.searchText}
                             />
                            <IconButton>
                                <SearchIcon onClick={this.fetchProducts} />
                            </IconButton>
                                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                                Sort By
                                </InputLabel>
                                <NativeSelect
                                    value={this.state.filter}
                                    onChange={this.onChangeFilter}
                                >
                                    <option value="">None</option>
                                    <option value='bundlePrice'>By Price</option>
                                    <option value='ratings'>By Ratings</option>
                                    <option value='itemsLeft'>By Quantity</option>
                                </NativeSelect>

                                <IconButton>
                                    <SortIcon onClick={this.fetchProducts} />
                                </IconButton>

                        </Box>
                    </Box>
                    <hr size="5" style={{color: 'black', display: 'block', backgroundColor: 'black'}}></hr>
                </div>
                <div>
                    <Grid container spacing={3} alignItems="center" justify="center">
                        {allProducts}
                    </Grid>
                </div>
                </Container>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={this.state.order}
                    autoHideDuration={6000}
                    onClose={() => {this.setState({order: false})}}
                    message="Order Placed"
                >
                    <Alert onClose={() => {this.setState({order: false})}} severity="success">
                        Order placed succesfully!!!
                    </Alert>
                </Snackbar>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={this.state.invalidOrder}
                    autoHideDuration={6000}
                    onClose={() => {this.setState({invalidOrder: false})}}
                >
                    <Alert onClose={() => {this.setState({invalidOrder: false})}} severity="error">
                        Such an order is not possible!!!
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}
export default withCookies(withStyles(styles)(Customer));