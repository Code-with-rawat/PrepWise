import { useEffect, useState } from "react";
import { getAllInterviewReports } from "../Services/interview.api.js";
import { useNavigate } from "react-router";

export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await getAllInterviewReports();
                setReports(data.interviewReports);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 75) return "#22c55e";
        if (score >= 50) return "#f59e0b";
        return "#ef4444";
    };

    if (loading) return (
        <main style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#0f172a",
            color: "white"
        }}>
            <p>Loading reports...</p>
        </main>
    );

    return (
        <main style={{
            minHeight: "100vh",
            backgroundColor: "#0f172a",
            padding: "2rem",
            color: "white"
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem"
            }}>
                <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                    My <span style={{ color: "#60a5fa" }}>Reports</span>
                </h1>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                    }}
                >
                    + New Report
                </button>
            </div>

           
            {reports.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    marginTop: "5rem",
                    color: "#94a3b8"
                }}>
                    <p style={{ fontSize: "1.2rem" }}>No reports yet!</p>
                    <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        Generate your first interview report.
                    </p>
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            padding: "0.6rem 1.4rem",
                            borderRadius: "8px",
                            cursor: "pointer"
                        }}
                    >
                        Get Started
                    </button>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "1.2rem"
                }}>
                    {reports.map((report) => (
                        <div
                            key={report._id}
                            onClick={() => navigate(`/report/${report._id}`)}
                            style={{
                                backgroundColor: "#1e293b",
                                borderRadius: "12px",
                                padding: "1.4rem",
                                cursor: "pointer",
                                border: "1px solid #2a3344",
                                transition: "border 0.2s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.border = "1px solid #3b82f6"}
                            onMouseLeave={e => e.currentTarget.style.border = "1px solid #2a3344"}
                        >
                            {/* Title */}
                            <h2 style={{
                                fontSize: "1rem",
                                fontWeight: "600",
                                marginBottom: "0.5rem",
                                color: "white"
                            }}>
                                {report.title || "Interview Report"}
                            </h2>

                            {/* Job Description Preview */}
                            <p style={{
                                fontSize: "0.8rem",
                                color: "#94a3b8",
                                marginBottom: "1rem",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical"
                            }}>
                                {report.jobDescription}
                            </p>

                            {/* Score + Date */}
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                {/* Match Score */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.4rem"
                                }}>
                                    <span style={{
                                        width: "10px",
                                        height: "10px",
                                        borderRadius: "50%",
                                        backgroundColor: getScoreColor(report.matchScore),
                                        display: "inline-block"
                                    }}></span>
                                    <span style={{
                                        color: getScoreColor(report.matchScore),
                                        fontWeight: "bold",
                                        fontSize: "0.9rem"
                                    }}>
                                        {report.matchScore}% Match
                                    </span>
                                </div>

                                {/* Date */}
                                <span style={{
                                    fontSize: "0.75rem",
                                    color: "#64748b"
                                }}>
                                    {new Date(report.createdAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </span>
                            </div>

                            {/* Skill Gaps */}
                            {report.skillGaps && report.skillGaps.length > 0 && (
                                <div style={{
                                    marginTop: "0.8rem",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.4rem"
                                }}>
                                    {report.skillGaps.slice(0, 3).map((gap, i) => (
                                        <span key={i} style={{
                                            fontSize: "0.7rem",
                                            padding: "2px 8px",
                                            borderRadius: "99px",
                                            backgroundColor: gap.severity === "high" ? "#450a0a" :
                                                gap.severity === "medium" ? "#451a03" : "#052e16",
                                            color: gap.severity === "high" ? "#ef4444" :
                                                gap.severity === "medium" ? "#f59e0b" : "#22c55e",
                                        }}>
                                            {gap.skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}