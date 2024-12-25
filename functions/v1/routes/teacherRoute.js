const express = require('express');
const { teacherDetail, getTeacherDetail, patchTeacherDetail, updateSubjects, updateAvailability, updateLocation } = require('../controllers/teacherController');
const router = express.Router()

router.route("/teacherDetail").post(teacherDetail)
router.route("/get-teacher-detail").get(getTeacherDetail)
router.route("/patchTeacherDetail").patch(patchTeacherDetail)
router.route("/update-subject").post(updateSubjects)
router.route("/update-availability").post(updateAvailability)
router.route("/update-location").post(updateLocation)

module.exports = router
