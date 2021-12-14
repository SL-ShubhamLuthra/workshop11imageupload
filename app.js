const mongoose = require('mongoose');
const connection = require('./connection');
const multer = require('multer');
const path = require('path');
const express = require('express');
const mimetype = require('mime-types');
const model = require('./model');
const schema = require('./schema');




const app = express();
app.use(express.json());

//storing file on location with filename and extension
const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, 'uploadedimage');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }

})

//checking file extension
function checkFile(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;

    const extname = filetypes.test(path.extname(file.originalname.toLowerCase()))

    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)

    }
    else {
        cb('error:image only!')
    }
}


const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFile(file, cb)
    }
}).single('myImage')



//api to save image in directory and db both

app.post('/uploads', async (req, res) => {


    //calling upload
    upload(req, res,async(err) => {
        if (err) {
            res.send(err);
        }
        else {
            if (req.file == undefined) {
                res.send('no file selected');
            }
            else {

                // res.send({ msg: 'file uploaded', file: `uploadedimage/${req.file.filename}` })
                const data = new model({
                    filename: req.file.filename,
                    imagepath: req.file.path,
                    imageext: req.file.mimetype,
                    imagesize: req.file.size
                })
                let result = await data.save()
                res.status(201).send({ msg: 'file uploaded!!', result });


            }
        }
    });


});

//api to delete image data from db
app.delete('/delete',async(req,res)=>{

  
   let ack=await model.deleteOne({_id:req.body.id});
    res.send(ack);

});

// api to update filename in db
app.put('/update/:id',async (req,res)=>{

      
        model.findOneAndUpdate({_id:req.params.id},{$set:{filename:req.body.filename}}).then(result=>{
           res.status(201).json({
               updated_data:result
           })
       }).catch(err=>{
           console.log(err)
           res.status(500).json({
               error:err
           });
       })


    // let abc =await model.updateOne({_id:req.params.id},{$set:{filename:req.body.filename}});
    
    //                 res.status(201).json({updated_result:abc});

     });



app.listen(3000)