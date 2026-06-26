import React from "react";
import { useState, useRef } from "react";
import "../Style/Home.scss";
import { useNavigate } from "react-router";
import { useInterview } from "../Hooks/useInterview";

function Home() {
  const { loading, generateReport, reports } = useInterview();
  const [isDragOver, setIsDragOver] = useState(false)
const [selectedFile, setSelectedFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);

    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    } else {
      console.error("Data is null or missing _id", data);
      alert("Failed to generate report. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Matching your skills with the right interview approach...</h1>
      </main>
    );
  }
  return (
    <div className="home-page">
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

        {/* Tooltip */}
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

      {/* Dashboard Overlay - Same Page */}
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
          {/* Close Button */}
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

          {/* Dashboard Content */}
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

            {reports.length === 0 ? (
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
      )}

      <header className="page-header">
        <h1>
          Create Your Custom <span className="highlight">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </header>

      <div className="interview-card">
        <div className="interview-card__body">
          <div className="panel panel--left">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </span>
              <h2>Target Job Description</h2>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
            />
            <div className="char-counter">0 / 5000 chars</div>
          </div>

          <div className="panel-divider" />

          <div className="panel panel--right">
            <div className="panel__header">
              <span className="panel__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <h2>Your Profile</h2>
            </div>

            <div className="upload-section">
              <label className="section-label">
                Upload Resume
                <span className="badge badge--best">Best Results</span>
              </label>
              <label
                className={`dropzone ${isDragOver ? "is-dragover" : ""} ${selectedFile ? "has-file" : ""}`}
                htmlFor="resume"
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file && resumeInputRef.current) {
                    resumeInputRef.current.files = e.dataTransfer.files;
                    setSelectedFile(file);
                  }
                }}
              >
                {selectedFile ? (
                  <div className="file-card">
                    <span className="file-card__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </span>
                    <div className="file-card__info">
                      <p className="file-card__name">{selectedFile.name}</p>
                      <p className="file-card__size">
                        {(selectedFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      className="file-card__remove"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFile(null);
                        if (resumeInputRef.current)
                          resumeInputRef.current.value = "";
                      }}
                      aria-label="Remove file"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <span className="dropzone__prompt">
                    <span className="dropzone__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="16 16 12 12 8 16" />
                        <line x1="12" y1="12" x2="12" y2="21" />
                        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                      </svg>
                    </span>
                    <p className="dropzone__title">
                      Click to upload or drag &amp; drop
                    </p>
                    <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                  </span>
                )}
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                  onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                />
              </label>
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation &bull; Approx 30s
          </span>
          <button onClick={handleGenerateReport} className="generate-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>
    </div>
  );
}

export default Home;
