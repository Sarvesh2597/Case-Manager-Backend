const mongoose = require('mongoose');
const Schema = mongoose.Schema;
AdminSchema = new Schema({
    nameOfEntity : String,
    address : String,
    city : String,
    state : String,
    zipcode : Number,
    contact : Number,
    email: String
});
module.exports = mongoose.model('Admin', AdminSchema);