const express = require("express");
const app = express();
const admin = require("firebase-admin");
const credentials = require("./firebase/firebase.json");
const { encryptedData,decryptedData } = require("./crypto");

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
        const user = req.body;
        //encrypt password
        user.password = encryptedData(user.password);
        try {
            const response = await db.collection("users").add(user);
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
            var arr = [];
            userDoc.forEach(doc => {
                arr.push(doc.data());
            });
            res.status(200).json(arr);
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    getAllBookList: async (req, res) => {
        try {
            const userId = req.params.id;
            const userDoc = await db.collection("BookList").get();
            var arr = [];
            userDoc.forEach(doc => {
                arr.push(doc.data());
            });
            res.status(200).json(arr);
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    validateUser: async(req, res) => {
        let {email,password} = req.body;
        // Validate the user's input
        try{
            const userDoc = await db.collection('users').where('email', '==', email).get();
            if(userDoc.size == 0) {
                return res.status(404).send({
                    message: {},
                    valid: false
                });
            }else{
                const user = userDoc.docs[0].data();
                // compare passwords
                if (password == decryptedData(user.password)){
                    return res.status(200).send({
                        message: user,
                        valid: true
                    })
                }
                else{
                    return res.status(401).send({
                        message: {},
                        valid: false
                    })
                }
            }
        }
        catch(error){
            console.error(error);
            res.status(500).json(error);
        }
    },
    AddBookByUser :async(req,res)=>{
        try {
            const book = req.body;
            const response = await db.collection("BookList").add(book);
            res.status(201).send(`book added with ID: ${response.id}`);

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
app.get("/login", controller.validateUser);
app.get("/addbookbyuser", controller.AddBookByUser);
app.get("/getAllBookList",controller.getAllBookList);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

