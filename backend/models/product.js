var mongoose = require('mongoose');
var Schema = mongoose.Schema

var ProductSchema = new Schema(
    {
    	userId: String,
    	productName: String,
    	bundlePrice: Number,
    	bundleQuantity: Number
    },
    { collection: 'products'}
)

module.exports = mongoose.model('Product', ProductSchema)