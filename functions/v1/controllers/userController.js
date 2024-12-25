const admin = require("firebase-admin");
const db = admin.firestore();



const sendRequest = async (req, res) => {
    const { userId, teacherId, subject, proposedPrice } = req.body;

    if (!userId || !teacherId || !subject || !proposedPrice) {
        return res.status(400).send({ error: "All fields are required" });
    }

    const requestData = {
        userId,
        teacherId,
        subject,
        proposedPrice,
        status: "Pending",
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection("requests").add(requestData);
        res.status(201).send({ message: "Request sent successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


const submitReview = async (req, res) => {
    const { teacherId, userId, rating, comment } = req.body;

    if (!teacherId || !userId || !rating || rating < 1 || rating > 5) {
        return res.status(400).send({ error: "Invalid input" });
    }

    const reviewData = {
        teacherId,
        userId,
        rating,
        comment: comment || "",
        createdAt: new Date().toISOString()
    };

    try {
        await db.collection("ratings").add(reviewData);

        res.status(201).send({ message: "Review submitted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
