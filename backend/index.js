const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');

// Load environment variables from .env file
dotenv.config();

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database is connected successfully!");
    } catch (err) {
        console.log(err);
    }
};

// Middlewares
app.use(cors({
    origin: ["https://blog-frontend-ivory-ten.vercel.app"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, fn) => {
        fn(null, "images");
    },
    filename: (req, file, fn) => {
        fn(null, req.body.img);
        // fn(null, "image1.jpg");
    }
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image has been uploaded successfully!");
});

// Start the server
app.listen(process.env.PORT, () => {
    connectDB();
    console.log("app is running on port " + process.env.PORT);
});
