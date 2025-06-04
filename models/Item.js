const mongoose = require("mongoose");
const ItemSchemea = new mongoose.Schema({
title:{
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
},
description: {
    type: String,
    trim: true, 
    maxlength: [500, 'Description cannot be more than 500 characters']
}
},
{
    timestamps: true
   
}


);

module.exports = mongoose.model('Item', ItemSchemea);