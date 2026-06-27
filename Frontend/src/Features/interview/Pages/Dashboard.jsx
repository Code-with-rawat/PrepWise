import react from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../Hooks/useInterview";

export default function Dashboard () {
    const [showDashboard, setShowDashboard] = useState(false);
    const { loading, generateReport, reports, getReports } = useInterview();
    const navigate = useNavigate();


      useEffect(() => {
        if(showDashboard) {
            getReports();
        }
    }, [showDashboard]);


    return (
          <>
        <div style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 1000,
      }}>
        <div
          onClick={() => setShowDashboard(!showDashboard)}
          style={{
            width: "44px",
            height: "44px",
            backgroundColor: showDashboard ? "#3b82f6" : "#1e293b",
            border: `1px solid ${showDashboard ? "#3b82f6" : "#2a3344"}`,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            position: "relative",
          }}
          title="My Reports"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.border = "1px solid #3b82f6";
          }}
          onMouseLeave={e => {
            if (!showDashboard) {
              e.currentTarget.style.backgroundColor = "#1e293b";
              e.currentTarget.style.border = "1px solid #2a3344";
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        </div>

        <span style={{
          position: "absolute",
          left: "52px",
          top: "50%",
          transform: "translateY(-50%)",
          backgroundColor: "#1e293b",
          color: "white",
          fontSize: "0.75rem",
          padding: "4px 10px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
          border: "1px solid #2a3344",
          pointerEvents: "none",
          marginTop: "-22px"
        }}>
          My Reports
        </span>
      </div>

    
      {showDashboard && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#0f172a",
          zIndex: 999,
          overflowY: "auto",
          padding: "5rem 2rem 2rem",
        }}>

          <button
            onClick={() => setShowDashboard(false)}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              backgroundColor: "#1e293b",
              border: "1px solid #2a3344",
              borderRadius: "10px",
              width: "44px",
              height: "44px",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>


          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem"
            }}>
              <h1 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>
                My <span style={{ color: "#60a5fa" }}>Reports</span>
              </h1>
              <button
                onClick={() => setShowDashboard(false)}
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



            {loading ? (
              <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "8rem" }}>
                <p>Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div style={{
                textAlign: "center",
                marginTop: "8rem",
                color: "#94a3b8"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
                <p style={{ fontSize: "1.2rem", color: "white" }}>No reports yet!</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Generate your first interview report.
                </p>
                <button
                  onClick={() => setShowDashboard(false)}
                  style={{
                    marginTop: "1.5rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "0.7rem 1.6rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "0.95rem"
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
                    onClick={() => {
                      setShowDashboard(false);
                      navigate(`/interview/${report._id}`);
                    }}
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
                    <h2 style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "white",
                      marginBottom: "0.5rem"
                    }}>
                      {report.title || "Interview Report"}
                    </h2>

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

                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span style={{
                        color: report.matchScore >= 75 ? "#22c55e" :
                               report.matchScore >= 50 ? "#f59e0b" : "#ef4444",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                      }}>
                        {report.matchScore}% Match
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {new Date(report.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )};
          </>
    )
}