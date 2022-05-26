
// load mongoose since we need it to define a model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
InsurerSchema = new Schema({
    nameOfEntity : String,
    address : String,
    city : String,
    state : String,
    zipcode : Number,
    contact : Number,
    email: String
});
module.exports = mongoose.model('Insurer', InsurerSchema);