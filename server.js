const express = require("express");
const app = express();

const {controller} = require("./controller/usercontroller");

app.use(express.json()); // Parse JSON bodies (this will let us get
app.use(express.urlencoded()); // Parse URL-encoded bodies (helps with handling form data)

app.post("/user", controller.addUser);
app.get("/user/:userId", controller.getUser);
app.get("/user/", controller.getAllUsers);
app.get("/login", controller.validateUser);
app.get("/addbookbyuser", controller.AddBookByUser);
app.get("/getAllBookList", controller.getAllBookList);
app.get("/getAllBookList", controller.getAllBookList);
app.post('/associate', controller.assignBookToUser);
app.get('/search', controller.searchBook);
app.get('/users/:userId/getAssignedBook', controller.getAssignedBook);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})