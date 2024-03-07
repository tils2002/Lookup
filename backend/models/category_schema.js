const mongoose = require('mongoose');
const Main = mongoose.Schema;

const schema = new Main({
    maincategory: ({
        type: String,        
    }),
    description:({
        type:String
    }),
    
})

const MyModel = mongoose.model('maincategory', schema);

module.exports = MyModel