const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("node:fs");

const app = express();

const port = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/registration").then(()=>{
    console.log("Database Connected")
}).catch((e)=>{
    console.log(e)
    console.log("Database Can't Be Connected")
})

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    let a = fs.readFileSync("index.html")
    res.send(a.toString());
});

// Use app.post for handling POST requests
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate the input data (you may need to add more validation logic)
        if (!name || !email || !password) {
            throw new Error("Name, email, and password are required.");
        }

        const registrationData = new Registration({
            name,
            email,
            password
        });

        await registrationData.save();
        console.log("Registration successful:", registrationData);

        res.redirect("/success");
    } catch (error) {
        console.error("Registration error:", error.message);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    let a = fs.readFileSync("success.html")
    res.send(a.toString());
});

app.get("/error", (req, res) => {
    let a = fs.readFileSync("error.html")
    res.send(a.toString());
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
