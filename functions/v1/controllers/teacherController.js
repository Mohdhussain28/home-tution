const admin = require("firebase-admin");
const db = admin.firestore();

const teacherDetail = async (req, res) => {
    const {
        name,
        email,
        number,
        dob,
        gender,
        metric_schoolName,
        metric_passingYear,
        metric_grades,
        metric_place,
        intermediate_schoolName,
        intermediate_passingYear,
        intermediate_grades,
        intermediate_place
    } = req?.body;

    if (!name || !email || !number) {
        return res.status(400).send({ error: "Missing required fields" });
    }

    const data = {
        personalDetail: { name, email, number, dob, gender },
        educationalDetail: {
            metric: {
                grades: metric_grades,
                schoolName: metric_schoolName,
                passingYear: metric_passingYear,
                place: metric_place
            },
            intermediate: {
                grades: intermediate_grades,
                schoolName: intermediate_schoolName,
                passingYear: intermediate_passingYear,
                place: intermediate_place
            }
        }
    };

    try {
        await db.collection("teacherDetail").doc("test-user").set(data, { merge: true });


        res.status(201).send({ message: "Detail saved" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateSubjects = async (req, res) => {
    const teacherId = req.query?.teacherId;
    const subjects = req.body.subjects;

    if (!teacherId || !subjects || !Array.isArray(subjects)) {
        return res.status(400).send({ error: "Invalid input" });
    }

    try {
        const docRef = db.collection("teacherDetail").doc(teacherId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: "Teacher not found" });
        }

        await docRef.update({ subjects });

        res.status(200).send({ message: "Subjects updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getTeacherDetail = async (req, res) => {
    const teacherId = req.query?.teacherId;

    if (!teacherId) {
        return res.status(404).send("Teacher is not found")
    }

    try {
        const doc = await db.collection("teacherDetail").doc(teacherId).get();
        if (!doc.exists) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        const teacherDetail = doc.data();
        res.status(200).json({ message: "successfully retrieved", teacherDetail: teacherDetail })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}

const patchTeacherDetail = async (req, res) => {
    const teacherId = req.query?.teacherId;
    const updateData = req.body;

    if (!teacherId) {
        return res.status(404).send({ message: "Teacher ID is not provided" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).send({ message: "No data provided to update" });
    }

    try {
        const docRef = db.collection("teacherDetail").doc(teacherId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send({ message: "Teacher not found" });
        }

        await docRef.update(updateData);

        res.status(200).send({ message: "Teacher details updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateAvailability = async (req, res) => {
    const teacherId = req.query?.teacherId;
    const availability = req.body.availability;

    // Example: availability = [{ day: "Monday", start: "10:00 AM", end: "12:00 PM" }, ...]

    if (!teacherId || !availability || !Array.isArray(availability)) {
        return res.status(400).send({ error: "Invalid input" });
    }

    try {
        const docRef = db.collection("teacherDetail").doc(teacherId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: "Teacher not found" });
        }

        await docRef.update({ availability });

        res.status(200).send({ message: "Availability updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const updateLocation = async (req, res) => {
    const teacherId = req.query?.teacherId;
    const location = req.body.location;

    // Example: location = { city: "New York", area: "Brooklyn", coordinates: { lat: 40.6782, lng: -73.9442 } }

    if (!teacherId || !location) {
        return res.status(400).send({ error: "Invalid input" });
    }

    try {
        const docRef = db.collection("teacherDetail").doc(teacherId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).send({ error: "Teacher not found" });
        }

        await docRef.update({ location });

        res.status(200).send({ message: "Location updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getTeacherRatings = async (req, res) => {
    const { teacherId } = req.query;

    if (!teacherId) {
        return res.status(400).send({ error: "Teacher ID is required" });
    }

    try {
        const snapshot = await db
            .collection("ratings")
            .where("teacherId", "==", teacherId)
            .get();

        if (snapshot.empty) {
            return res.status(404).send({ message: "No reviews found" });
        }

        const reviews = snapshot.docs.map(doc => doc.data());
        res.status(200).send({ reviews });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const searchTeachers = async (req, res) => {
    const { subject, city, rating } = req.query;

    try {
        let query = db.collection("teacherDetail");

        if (subject) query = query.where("subjects", "array-contains", subject);
        if (city) query = query.where("location.city", "==", city);
        if (rating) query = query.where("averageRating", ">=", parseFloat(rating));

        const snapshot = await query.get();
        if (snapshot.empty) return res.status(404).send({ message: "No teachers found" });

        const teachers = snapshot.docs.map(doc => doc.data());
        res.status(200).send({ teachers });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


module.exports = { teacherDetail, getTeacherDetail, patchTeacherDetail, updateSubjects, updateAvailability, updateLocation };
