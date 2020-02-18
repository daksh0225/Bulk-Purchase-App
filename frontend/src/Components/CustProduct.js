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
import { Container, Card , Box} from '@material-ui/core';

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
        // background: 'linear-gradient(90deg, #02acbf 30%, #046c78 90%)'
    },
    action: {
        float: 'right'
    }
    // toolbar: {
    //   display: 'flex',
    //   alignItems: 'center',
    //   flexDirection: 'row',
    //   justifyContent: 'spaceAround'
    // }
  });

class Product extends Component{
    constructor(){
        super()
        this.state = {
            quantity: 0
        }
    }
    render(){
        const {classes} = this.props
        const quantity = 0
        return(
            <Grid item xs={5} className={classes.divider}>
                <Card className={classes.root, classes.card}>
                    <CardContent>
                        {/* <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {this.state.data[i].productName}
                        </Typography> */}
                        <Box display="flex" alignItems="center" flexDirection="row" justifyContent="space-around">
                            <Box display="flex" alignItems="center" flexDirection="column" justifyContent="space-around">
                                <Typography variant="h5" component="h2">
                                    {this.props.item.productName}
                                </Typography>
                                {/* <Typography className={classes.pos} color="textSecondary">
                                adjective
                                </Typography> */}
                                <Typography variant="body2" component="p">
                                    Bundle Price: {this.props.item.bundlePrice}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Bundle Quantity: {this.props.item.bundleQuantity}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Items Left: {this.props.item.itemsLeft}
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" flexDirection="column" justifyContent="space-around">
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type="number"
                                    id="itemQuantity"
                                    label="Item Quantity"
                                    name="itemQuantity"
                                    autoComplete="itemQuantity"
                                    // min='0'
                                    // max={this.props.itemsLeft}
                                    onChange = {(event) => this.props.onChangeItemQuantity(event, this.props.item._id)}
                                    value = {this.props.itemQuantity}
                                    // value = {quantity}
                                />
                            </Box>
                        {/* <Typography variant="body2" component="p">
                        well meaning and kindly.
                        <br />
                        {'"a benevolent smile"'}
                        </Typography> */}
                        </Box>
                    </CardContent>
                    <CardActions className={classes.action}>
                        <Button size="small" style={{color: "blue"}} onClick = {() => this.props.order(this.props.item.productName, this.props.item.itemsLeft, this.props.item._id)} >Place Order</Button>
                    </CardActions>
                </Card>
            </Grid>
        )
    }
}

export default withStyles(styles)(Product)