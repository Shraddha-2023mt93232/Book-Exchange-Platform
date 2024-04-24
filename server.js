const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./firebase/firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

app.use(express.json()); // Parse JSON bodies (this will let us get
app.use(express.urlencoded()); // Parse URL-encoded bodies (helps with handling form data)

const controller = {
    hello: async (req, res) => {
        try {
            res.status(200).send('Hello World!');
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    },
    addUser: async (req, res) => {
        try {
            const response = await db.collection("users").add(req.body);
            res.status(201).send(`user added with ID: ${response.id}`);
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    getUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(userDoc.data());
            }
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const userId = req.params.id;
            const userDoc = await db.collection("users").get();
            console.log(userDoc);
            var arr = [];
            userDoc.forEach(doc => {
                arr.push(doc.data());
            });
            res.status(200).json(arr);
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    }
};

app.get("/", controller.hello);
app.post("/user", controller.addUser);
app.get("/user/:id", controller.getUser);
app.get("/user/", controller.getAllUsers);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

