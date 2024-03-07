const mongoose = require('mongoose');
const Sub = mongoose.Schema;

const schema = new Sub({
    maincategoryid: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories',      
    }),
    subcategoryid: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subcategories',      
    }),
    subdata: ({
        type: String,        
    }),
    description:({
        type:String
    }),
    name:({
        type:String
    })
})

const MyModel = mongoose.model('subdata', schema);

module.exports = MyModel



