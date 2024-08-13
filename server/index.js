const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const { authenticateJWT, JWT_SECRET } = require('./Middleware/authwnticateJWT');
const EmployeeModel = require("./Models/Employee");

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoose.connect("mongodb://localhost:27017/employee");

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    EmployeeModel.findOne({ email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
                    const imageUrl = user.file ? `/uploads/${user.file}` : null;
                    res.json({ status: 'success', token, user: { ...user.toObject(), imageUrl } });
                } else {
                    res.json({ status: 'failure', message: 'Invalid Password' });
                }
            } else {
                res.json({ status: 'failure', message: 'User not found' });
            }
        })
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Define upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
    }
});
const upload = multer({ storage });

app.post('/register', upload.single('file'), (req, res) => {
    const { name, email, password } = req.body;
    const filePath = req.file ? req.file.path : null;
    const fileName = filePath ? path.basename(filePath) : null;
    EmployeeModel.create({ name, email, password, file:fileName })
        .then(employee => res.json(employee))
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});

// Use the middleware on routes that need protection
app.get('/employees', authenticateJWT, (req, res) => {
    EmployeeModel.find({})
        .then(employees => res.json(employees))
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});

app.put('/employees/:id', authenticateJWT, (req, res) => {

    const { id } = req.params;
    const updateData = req.body;
    EmployeeModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedEmployee => res.json(updatedEmployee))
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});

app.delete('/employees/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    EmployeeModel.findByIdAndDelete(id)
        .then(deletedEmployee => {
            if (deletedEmployee) {
                res.json({ status: 'success', message: 'Employee deleted' });
            } else {
                res.status(404).json({ status: 'failure', message: 'Employee not found' });
            }
        })
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});
    
app.listen(3001, () =>
    console.log("Server is running on port 3001")
);

