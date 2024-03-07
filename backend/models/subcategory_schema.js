const mongoose = require('mongoose');
const Subcategory = mongoose.Schema;

const schema = new Subcategory({
    maincategoryid: ({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'maincategories',      
    }),
    subcategory: ({
        type: String,        
    }),
    description:({
        type:String
    })
})

const MyModel = mongoose.model('subcategory', schema);

module.exports = MyModel



