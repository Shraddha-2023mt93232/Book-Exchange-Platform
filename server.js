const express = require("express");
const app = express();

const {controller} = require("./controller/controller");

app.use(express.json()); // Parse JSON bodies (this will let us get
app.use(express.urlencoded()); // Parse URL-encoded bodies (helps with handling form data)

app.post("/add/:entity", controller.addEntity);
app.get("/user/:userId", controller.getUser);
app.get("/list/:entity", controller.getAllEntity);
app.get("/login", controller.validateUser);
app.post('/assign', controller.assignBookToUser);
app.post('/search', controller.search);
app.get('/users/:userId/getAssignedBook', controller.getAssignedBook);
app.post('/message', controller.message);
app.post('/chatbox',controller.chatbox);
app.post('/submitBook/:userId',controller.submitBook);
app.post('/deleteAccount/:userId',controller.deleteAccount);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})