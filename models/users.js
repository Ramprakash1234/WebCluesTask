import mongoose from 'mongoose';

const usersSchema = new mongoose.Schema({
    name: { 
      type:String
    },
    email: {
      type: String,
    },
    password:{
      type:String
    },
    picturelink: { 
      type:String
    }
});

export default mongoose.model('users', usersSchema);
