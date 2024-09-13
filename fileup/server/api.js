


const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb://localhost:27017";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);  
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|svg/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only images are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


app.use('/uploads', express.static('uploads'));


app.get("/api/mycoll", async (req, res) => {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const mycollData = await client.db("mydb").collection("mycoll").find({}).toArray();
    res.json(mycollData);
    client.close();
});


app.post("/api/mycoll", upload.single('file'), async (req, res) => {
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const newDocument = {
        name: req.body.name,
        gmail: req.body.gmail,
        password: req.body.password,
        fileName: req.file ? req.file.filename : null,  
        filePath: req.file ? req.file.path : null,     
        fileType: req.file ? req.file.mimetype : null  
    };

    const result = await client.db("mydb").collection("mycoll").insertOne(newDocument);
    res.status(201).json({ message: "Data and file uploaded successfully", result: newDocument });
    client.close();
});



app.listen(5000, () => console.log("Server running on http://localhost:5000"));
