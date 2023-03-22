const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const path = require('path')
const multer = require('multer');
let hbs = require('express-handlebars')
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))


app.engine('.hbs' , hbs.engine({
    extname: "hbs" ,
    defaultLayout: '',
    layoutsDir: '',
}))
app.set('view engine', '.hbs')

app.get('/' , function(req , res){
    res.render('upload');
})
// SET STORAGE
let storage = multer.diskStorage({
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

        for (let i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            } else {
                newFileName += ('-' + Date.now() + '.' + arr[i]);
            }
        }

        cb(null, newFileName)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        var ext = path.extname(file.originalname);
        if (ext !== '.jpg') {
            return cb(new Error('Hãy upload file .JPEG'))
        }
        cb(null, true)
    }
    , limits: { fileSize: 3 * 1024 * 1024 },
})

let up = upload.array('myFiles', 5)
app.post('/uploadmultiple', function (req, res) {

    up(req, res, function (err) {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.send('Kích thước file lớn hơn 3 MB')
            } else {
                res.send(err.message)
            }
        } else {
            res.send('Upload file Thành công');
        }
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});