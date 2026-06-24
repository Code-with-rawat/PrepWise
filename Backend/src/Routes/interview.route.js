const express = require('express');
const authMiddleware = require('../Middleware/auth.middleware.js');
const { generateInterviewReporting,getInterviewReportByIdController, getAllInterviewReportsController , generateResumePdfController} = require('../Controllers/interview.controller.js');
const upload = require('../middleware/file.middleware.js');

const interviewRouter = express.Router();

/**
 * @route POST api/interview/
 * @desc generate new interview report on  the basis  on the basis of our self
 * description, resume pdf and job description.
 * @access private 
 */

interviewRouter.post('/',authMiddleware, upload.single("resume"), generateInterviewReporting);

/**
 * @route GET api/interview/report/:interviewId
 * @desc get the interview report by id
 * @access private
 */
interviewRouter.get('/:interviewId', authMiddleware, getInterviewReportByIdController );

/**
 * @route GET api/interview
 * @desc get all interview reports of the user
 * @access private
 */

interviewRouter.get('/', authMiddleware, getAllInterviewReportsController)

/**
 * @route Get/api/interview/resume/pdf
 * @desc generate resume pdf on the basis of self description and job description
 * @access private
 */

interviewRouter.post('/resume/pdf/:interviewReportId',  authMiddleware, generateResumePdfController)

module.exports = interviewRouter;