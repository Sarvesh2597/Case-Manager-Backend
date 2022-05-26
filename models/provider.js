const mongoose = require('mongoose');
const Schema = mongoose.Schema;
ProviderSchema = new Schema({
    nameOfProvider : String,
    address : String,
    city : String,
    state : String,
    zipcode : Number,
    contact : Number,
    email: String
});
module.exports = mongoose.model('Provider', ProviderSchema);