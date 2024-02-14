let mongoose = require('mongoose');

let personSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: false
    },
    owner: {
        type: Boolean,
        required: false
    }
});

let Person = module.exports = mongoose.model('Person', personSchema);