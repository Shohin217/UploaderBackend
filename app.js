const express = require('express');
const cors = require('cors');
const fsExtra = require('fs-extra');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

// backend/public
// backend\pulbic
// __dirname -> webpack, node.js
const publicPath = path.resolve(__dirname, 'public');

fsExtra.ensureDirSync(publicPath);

const server = express();
server.use(cors()); // подключение middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }))
// http://localhost:9999/static/file.png -> /public/file.png
server.use('/static', express.static(publicPath));

let media = [];

server.get('/api/media', (req, res) => {
    setTimeout(()=>{
        console.log(media)
        res.send(media);
    },1000)
});



server.delete('/api/media/:id', (req, res)=>{
setTimeout(()=>{
    const {id} = req.params;
    console.log(id)
    media = media.filter(o => o !== id)
    res.send()
},1000)
})

const storage = multer.diskStorage({
    destination(req, file, callback) {
        // функция, которая отвечает за то, куда грузить файл
        // null - ошибка
        callback(null, publicPath);
    },
    filename(req, file, callback) {
        const filename = uuid.v4();
        let ext = '';
        console.log(file.mimetype);
        switch (file.mimetype) {
            // video/audio
            // TODO: вынести в Map
            case 'image/png':
                ext = '.png';
                break;
            case 'image/jpeg':
                ext = '.jpg';
                break;
            case 'audio/mp3':
                ext = '.mp3';
                break;
            case 'video/webm':
                ext = '.webm';
                break;
            case 'video/mpeg':
                ext = '.mpeg';
                break;
            case 'video/mp4':
                ext = '.mp4'
                break;
            default:
                callback(new Error('invalid mime type'));
                return;
        }
        callback(null, `${filename}${ext}`);
    },
});

const fileUpload = multer({ storage }).single('media'); // файл (должен быть только один) в форме должен иметь имя media
server.post('/api/upload', (req, res) => {
   setTimeout(() => {
    fileUpload(req, res, err => {
        console.log(err);
        console.log(req.file);
        if (err) { // null, undefined, '', 0, false, NaN?
            res.status(400).send();
            return;
        }

        media = [req.file.filename, ...media]; // spread

        // backend не ленивый
        res.send({ name: req.file.filename }); // filename - то, что мы сами сгенерировали
    });
   }, 1000);
});


const port = process.env.PORT || 9999;
server.listen(port);