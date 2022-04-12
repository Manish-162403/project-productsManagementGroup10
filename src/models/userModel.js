const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

fname: {
    type:String,
    required: true
    
},

lname: {
    type:String,
    required:true
},

email: {
    type:String,
    required:true,
      unique:true
    },

profileImage: {
    type:String,
    required:true
},
 
phone: {
    type:String,
    required:true, 
    unique:true,
    // valid Indian mobile number
},

password: {
    type:String,
    required:true,
    }, // encrypted password

address: {
  shipping: {
    street: {type:String, required:true},
    city: {type:String, required:true},
    pincode: {type:Number, required:true}
  },

  billing: {
    street: {type:String, required:true},
    city: {type:String, required:true},
    pincode: {type:Number, required:true}
  },

}},{timestamps:true}
);


//hashing the password and storing it in the DB.

userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10);
})

module.exports = mongoose.model('createUser', userSchema)
