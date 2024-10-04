const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/sampledb')
    .then(() => console.log("mongoose db connected"))
    .catch(err => console.log("error mongoose not connected", err));

const Todo = mongoose.model('Todo', new mongoose.Schema({
    name: String,
    ID: Number,
    Check_status: Boolean
}));

const app = express();

app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.get('/', (req, res) => {
    Todo.find()
        .then(items => res.render('index', { x: items }))
        .catch(err => res.send("error loading data"));
});

app.post('/save-data', (req, res) => {
    const newItem = new Todo({
        name: req.body.data,
        ID: Date.now(),
        Check_status: false
    });

    newItem.save()
        .then(savedItem => res.status(200).json({ newItem: savedItem }))
        .catch(err => res.status(500).json({ message: "failed to save data" }));
});

app.post('/update-status', (req, res) => {
    const { id, status } = req.body;

    Todo.findByIdAndUpdate(id, { Check_status: status })
        .then(() => res.status(200).json({ message: "status updated successfully" }))
        .catch(err => res.status(500).json({ message: "failed to update status" }));
});

app.post('/delete-item', (req, res) => {
    const { id } = req.body;

    Todo.findByIdAndDelete(id)
        .then(() => res.status(200).json({ success: true }))
        .catch(err => res.status(500).json({ message: "failed to delete item" }));
});

app.listen(6565, () => {
    console.log("the server has been started!");
});
