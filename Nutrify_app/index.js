const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//importing module
const userModel = require("./models/userModel");
const foodModel = require("./models/foodModel");
const trackingModel = require("./models/trackingModel")
const verifyToken = require("./verifyToken")

const app = express();
app.use(express.json());


mongoose.connect("mongodb://localhost:27017/nutrify-app")
    .then(() => {
        console.log("Database successfully created");
    })
    .catch((err) => {
        console.log(err);
    })

//Endpoint for registration
app.post("/register", async (req, res) => {

    let user = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
            bcrypt.hash(user.password, salt, async (err, hpass) => {
                user.password = hpass;

                try {
                    let doc = await userModel.create(user)
                    res.status(201).send({ message: "User registered" })

                }
                catch (err) {
                    console.log(err);
                    res.status(500).send({ error: err.message, message: "Some issue" })

                }
            })
        }
    })
})

//Endpoint for login
app.post("/login", async (req, res) => {

    let userCred = req.body;

    try {
        let user = await userModel.findOne({ email: userCred.email })
        if (user !== null) {
            bcrypt.compare(userCred.password, user.password, (err, result) => {
                if (result == true) {
                    jwt.sign({ email: userCred.email }, "nutrifyapp", (err, token) => {
                        if (!err) {
                            res.send({ token: token, message: "Login Successfull" })
                        }
                        else {
                            res.send({ message: "Unable to generate token login again" })
                        }
                    })

                }
                else {
                    res.status(403).send({ message: "Incorrect Password" })
                }
            })
        }

    }
    catch (err) {
        res.status(404).send({ message: "User not found" })
    }


})

//Endpoint to fetch all food items
app.get("/foods", verifyToken, async (req, res) => {
    try {
        let foods = await foodModel.find()
        res.send(foods)
    }
    catch (err) {
        res.status(500).send({ message: "Some problem" })
    }
})


//Search food by its name
app.get("/foods/:name", verifyToken, async (req, res) => {
    try {
        let foods = await foodModel.find({ name: { $regex: req.params.name, $options: 'i' } })
        if (foods.length !== 0) {
            res.send(foods)
        }
        else {
            res.status(404).send({ message: "Food item not found" })
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Some problem in getting the food item" })
    }

})

//Endpoint to track food
app.post("/track", verifyToken, async (req, res) => {
    let trackfood = req.body;

    try {
        let data = await trackingModel.create(trackfood)
        res.status(201).send(data)
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Some problem in adding the food item" })
    }

})

//Endpoint to fetch all food eaten by a person
app.get("/track/:userid/:date", verifyToken, async (req, res) => {

    let userid = req.params.userid;
    let [year, month, day] = req.params.date.split("-");
    let strDate = `${Number(month)}/${Number(day)}/${year}`;
    
    console.log(strDate);
    try {
        let data = await trackingModel.find({ user: userid, eatenDate: strDate }).populate("user").populate("food")
        res.send(data)

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ message: "Some problem in tracking the food item" })
    }
})


app.listen(8000, (() => {
    console.log("Connection Established")
}))