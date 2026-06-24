import { useContext } from "react";
import { InterviewContext } from "../interview.context.jsx";
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports , generateResumePdf} from "../Services/interview.api";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams()
    
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            } else {
                console.error("No interviewReport in response", response)
                return null
            }
            
        } catch (error) {
            console.log("Error generating report:", error)
            return null  // ✅ Return null on error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            
            if (response && response.interviewReport) {
                setReport(response.interviewReport)
                return response.interviewReport
            } else {
                console.error("No interviewReport found for id:", interviewId)
                return null
            }
            
        } catch (error) {
            console.log("Error getting report by id:", error)
            return null
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            
            if (response && response.interviewReports) {
                setReports(response.interviewReports)
                return response.interviewReports
            } else {
                console.error("No interviewReports in response", response)
                return []
            }
            
        } catch (error) {
            console.log("Error getting all reports:", error)
            return [] 
        } finally {
            setLoading(false)
        }
    }

    const getResumePdf = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePdf({ interviewId })
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `resume_${interviewId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
            catch (error) {
                console.log("Error getting resume PDF:", error)
            }
                finally {
                    setLoading(false)
                }
    }

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf

    }
}