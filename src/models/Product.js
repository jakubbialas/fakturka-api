var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String
}, { timestamps: true });

var Product = mongoose.model('Product', productSchema);

module.exports = Product;