import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import usersDb from './models/users.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./fileUploads/')
    },filename:function(req,file,cb){
        cb(null,'img'+file.originalname)
    }
});
// const upload = multer({ dest: 'fileUploads/' })
 const upload=multer({storage})

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=>console.log('DB connection established'))
.catch((err)=>{console.log('Failed to connect DB');
console.log(err)});


let app = express();
app.use(express.static('fileUploads'))
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), 'client', 'build')));
dotenv.config();

app.get('/allUsers',async(req,res)=>{
  const users=await usersDb.find({},{name:1,email:1,picturelink:1});
  res.send(users)
})

app.post("/addme", (req, res) => {
  bcrypt.hash(req.body.toStoreVals.password, saltRounds, function(err, hash) {
    usersDb.insertMany([{
      name:req.body.toStoreVals.name,
      email:req.body.toStoreVals.email,
      password:hash,
      picturelink:req.body.toStoreVals.fileName
    }])
    res.json("success");
});

});
app.post("/fileme",upload.single('profilePic'), (req, res) => {
  const portNumber=process.env.PORT||5005;
  res.json({fileName:`http://localhost:${portNumber}/${req.file.filename}`})
});
const dir = './fileUploads';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir, {
		recursive: true
	});
}
app.listen(process.env.PORT||5005, err =>{
    console.log(`app is running in port ${process.env.PORT||5005}`);
} )
  
