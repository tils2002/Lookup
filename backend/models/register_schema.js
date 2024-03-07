const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
    firstname: ({
        type: String,

        
    }),
    lastname: ({
        type: String,
        
    }),
    email: ({
        type: String,
        unique: [true, 'This Email Id is Alrady Register ']
    }),
    dob:({
        type:Date,
    }),
    phone:({
        type:Number,
        
    }),
    password:({
        type:String,        
    }),
    repassword:({
        type:String,
      
    })

})

const MyModel = mongoose.model('User_Registerdata', schema);

module.exports = MyModel