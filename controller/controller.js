const { db } = require("../firebase/dbconfig");
const { encryptedData, decryptedData } = require("../crypto");
const { Filter } = require("firebase-admin/firestore");
const { messaging } = require("firebase-admin");

const getCollection = {
    'user': 'users',
    'book': 'BookList'
}

const controller = {
    'addEntity': async (req, res) => {
        const entityName = req.params.entity;
        var entity = req.body;
        //encrypt password
        if (entityName === 'user') entity.password = encryptedData(entity.password);
        try {
            const response = await db.collection(getCollection[entityName]).add(entity);
            const id = response.id;
            var doc = await response.get();
            res.status(201).json({ ...doc.data(), id });
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    'getUser': async (req, res) => {
        try {
            const userId = req.params.userId;
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json({ ...userDoc.data(), id: userId });
            }
        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    'getAllEntity': async (req, res) => {
        try {
            const entity = req.params.entity;
            const userDoc = await db.collection(getCollection[entity]).get();
            var arr = [];
            userDoc.forEach(doc => {
                arr.push({ ...doc.data(), id: doc.id });
            });
            res.status(200).json(arr);
        } catch (error) {
            res.status(500).json({ error });
        }
    },
    'validateUser': async (req, res) => {
        let { email, password } = req.body;
        // Validate the user's input
        try {
            const userDoc = await db.collection('users').where('email', '==', email).get();
            if (userDoc.size == 0) {
                return res.status(404).send({
                    message: {},
                    valid: false
                });
            } else {
                const user = userDoc.docs[0].data();
                // compare passwords
                if (password == decryptedData(user.password)) {
                    return res.status(200).send({
                        message: user,
                        valid: true
                    })
                }
                else {
                    return res.status(401).send({
                        message: {},
                        valid: false
                    })
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },
    'assignBookToUser': async (req, res) => {
        try {
            const userDoc = await db.collection("exchange").add({
                "user": db.collection("users").doc(req.body.userId),
                "book": db.collection("BookList").doc(req.body.bookId)
            });
            res.status(200).send(`book with ID: ${req.body.bookId} assigned to user`);

        } catch (e) {
            console.error(e);
            res.status(500).json(e);
        }
    },
    'deleteAccount': async (req, res) => {
        const userId = req.params.userId;
        // Delete the exchange document where user matches the provided userId
        await db.collection('users').doc(userId).delete().then(() => {
            res.status(200).json({
                message: "User Deleted successfully"
            });
        }).catch((error) => {
            res.status(500).json({
                message: "Error deleting the user",
                error: error
            });
        })
    },
    'submitBook': async (req, res) => {
        const userId = req.params.userId;

        try {
            // Get the user document reference
            const userRef = db.collection('users').doc(userId);

            // Delete the exchange document where user matches the provided userId
            await db.collection('exchange').where('user', '==', userRef).get().then(querySnapshot => {
                querySnapshot.forEach(doc => doc.ref.delete());
            });

            res.status(200).json({
                message: "Book submitted successfully"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error submitting book"
            });
        }
    },
    'search': async (req, res) => {
        let {query,entity} = req.body;
        if (!query) return res.status(400).send('Query parameter is missing!');
        const { key, value } = query;
        const snapshot = await db.collection(getCollection[entity]).where(key, '==', value).get();
        if (!snapshot.empty) {
            let docs = snapshot.docs.map((doc) => {
                return {...doc.data(), id: doc.id}
            });
            res.status(200).json(docs);
        } else {
            res.status(404).json([]);
        }
    },
    'getAssignedBook': async (req, res) => {
        try {
            const userID = req.params.userId;
            const snapshot = await db.collection('exchange')
                .where('user', '==', db.collection('users').doc(userID))
                .get();
            var book = await snapshot.docs[0].data().book.get();
            res.status(200).json({ ...book.data(), id: book.id });
        }
        catch (error) {
            res.status(500).json(error);
        }
    },
    'message': async (req, res) => {
        try {
            const { message, sender, receiver } = req.body;
            const timeStamp = new Date();
            db.collection('message').add({
                message: message,
                sender: db.collection('users').doc(sender),
                receiver: db.collection('users').doc(receiver),
                timeStamp: timeStamp
            })
            res.status(200).json({
                "status": "Message sent"
            })
        }
        catch (e) {
            res.status(500).json({ "error": e });
        }
    },
    'chatbox': async (req, res) => {
        const { user1, user2 } = req.body;
        const snapshot = await db.collection('message')
            .where(Filter.or(Filter.and(Filter.where('sender', '==', db.collection('users').doc(user1), Filter.where('receiver', '==', db.collection('users').doc(user2)))), Filter.and(Filter.where('sender', '==', db.collection('users').doc(user2), Filter.where('receiver', '==', db.collection('users').doc(user1))))))
            .orderBy("timeStamp")
            .get();
        var messages = [];
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const message = data.message, timeStamp = data.timeStamp.toDate().toLocaleString();
            const sender = data.sender.id, receiver = data.receiver.id;
            messages.push({
                message: message,
                sender: sender,
                receiver: receiver,
                timeStamp: timeStamp
            })
        })
        res.status(200).json(messages);

    }
};

module.exports = { controller };