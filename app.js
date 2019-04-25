const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const storage = multer.diskStorage({
	destination: './resources/uploads/',
	filename: function(req, file, cb){
		cb(null, file.fieldname + '-' + Date.now()+
			path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits:{fileSize: 1000000},
	fileFilter: function(req, file, cb){
		checkFileType(file, cb);
	}
}).single('image');


function checkFileType(file, cb){
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);

	if(mimetype && extname){
		return cb(null, true);

	}

	else{
		cb('Error: Images Only!')
	}
}


const app = express();


app.set('view engine','ejs');


app.use(express.static('./resources'));


app.get('/', (req, res) => res.render('index'));

app.post ('/upload', (req, res) =>{
upload(req, res, (err) =>{
if(err){
	res.render('index', {
		msg: err
	});
}

else{
	if(req.file == undefined){
		res.render('index',{
			msg : 'Error: File is not selected!'
		});
	}

	
else{
	res.render('index', {
	msg: 'File Uploaded!',
	file: 'uploads/${req.file.filename}'
});
	}
}

});
});


const port = 3000;

app.listen(port, () => console.log('Server started on port 3000'));