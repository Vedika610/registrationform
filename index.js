const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Serve static files from the 'public' directory
app.use(express.static('public'));

const username = process.env.MONGOBD_USERNAME;
const password = process.env.MONGOBD_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.eaf7ori.mongodb.net/registrationFormDB`, { useNewUrlParser: true, useUnifiedTopology: true });

// Registration schema
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Mode of registration
const Registration = mongoose.model('User', registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/register', async(req, res) => {
    try {
        const { Uname, email, password } = req.body;

        const existinguser = await Registration.findOne({ email: email });
        if (!existinguser) {
            const registrationdata = new Registration({
                Uname,
                email,
                password
            });
            await registrationdata.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/error.html");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
