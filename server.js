const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');
const { MulterError } = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        var dir = './uploads';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        let fileName = file.originalname;
        arr = fileName.split('.');

        let newFileName = '';

        for (let i =0; i< arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }

        cb(null, newFileName)
    }

})
var upload = multer({ storage: storage , limits:{fileSize:1*1024*1024}});

var upload = upload.single('myFile');
app.post('/upload', function(req, res) {
    upload(req,res, function(err){
        if(err instanceof multer.MulterError){
            return res.send('Kích thước file lớn hơn 1 MB')
        }else{
            console.log(req.file);
            res.send('Thành công');
        }
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/bai4.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
