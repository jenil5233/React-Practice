const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const EmployeeModel = require("./Models/Employee")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/employee")

app.post('/login', (req, res) => {
     const { email, password } = req.body;
     EmployeeModel.findOne({ email: email })
         .then(user => {
             if (user) {
                 if (user.password === password) {
                     res.json({ status: 'success', user }); // Correctly formatted response
                 } else {
                     res.json({ status: 'failure', message: 'Login-failed' });
                 }
             } else {
                 res.json({ status: 'failure', message: 'User not found' });
             }
         })
         .catch(err => {
             res.status(500).json({ status: 'error', message: err.message });
         });
 });

app.post('/register', (req, res) => {
     console.log(req.body);
     EmployeeModel.create(req.body)
          .then(employees => res.json(employees))
          .catch(err => res.json(err))
})
app.get('/employees', (req, res) => {
    EmployeeModel.find({})
        .then(employees => res.json(employees))
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});
app.put('/employees/:id', (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    EmployeeModel.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedEmployee => res.json(updatedEmployee))
        .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});
app.delete('/employees/:id', (req, res) => {
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
     console.log("server is running")
)