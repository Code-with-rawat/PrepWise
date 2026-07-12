import React from "react";
import { useState, useRef, useEffect } from "react";
import "../Style/Home.scss";
import { useNavigate } from "react-router";
import { useInterview } from "../Hooks/useInterview";


function ProgressRing({ value, size = 40, stroke = 4 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const tier = value >= 80 ? "high" : value >= 60 ? "mid" : "low";

  return (
    <span className={`progress-ring progress-ring--${tier}`} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="progress-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="progress-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="progress-ring__label" style={{ fontSize: size * 0.28 }}>
        {value}%
      </span>
    </span>
  );
}

function Home() {
  const { loading, generateReport, reports, getReports } = useInterview();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [profileTab, setProfileTab] = useState("resume"); // "resume" | "text"
  const [jdCharCount, setJdCharCount] = useState(0);
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  const hasProfile = profileTab === "resume" ? !!selectedFile : selfDescription.trim().length > 0;
  const canGenerate = jobDescription.trim().length > 0 && hasProfile;

  const handleGenerateReport = async () => {
    if (!canGenerate) return;
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });

    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    } else {
      console.error("Data is null or missing _id", data);
      alert("Failed to generate report. Please try again.");
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Matching your skills with the right interview approach...</h1>
      </main>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        {/* step indicator — step 1 is active while filling the form */}
        <div className="step-indicator">
          <span className="step-indicator__item is-active">
            <span className="step-indicator__dot">1</span>
            Add Details
          </span>
          <span className="step-indicator__arrow">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
          <span className="step-indicator__item">
            <span className="step-indicator__dot">2</span>
            Generate Strategy
          </span>
        </div>

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
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setJdCharCount(e.target.value.length);
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
            />
            <div className={`char-counter ${jdCharCount > 4500 ? "is-near-limit" : ""} ${jdCharCount >= 5000 ? "is-at-limit" : ""}`}>
              <span />
              <span>{jdCharCount} / 5000 chars</span>
            </div>
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
              <span className="badge badge--required">Required</span>
            </div>

            {/* tab toggle replaces the old OR-divider so the requirement is clear upfront */}
            <div className="profile-tabs">
              <button
                type="button"
                className={`profile-tabs__btn ${profileTab === "resume" ? "is-active" : ""}`}
                onClick={() => setProfileTab("resume")}
              >
                Upload Resume
              </button>
              <button
                type="button"
                className={`profile-tabs__btn ${profileTab === "text" ? "is-active" : ""}`}
                onClick={() => setProfileTab("text")}
              >
                Write About Yourself
              </button>
            </div>

            {profileTab === "resume" ? (
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
            ) : (
              <div className="self-description">
                <label className="section-label" htmlFor="selfDescription">
                  Quick Self-Description
                </label>
                <textarea
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  id="selfDescription"
                  name="selfDescription"
                  className="panel__textarea panel__textarea--short"
                  placeholder="Briefly describe your experience, key skills, and years of experience..."
                  maxLength={5000}
                />
              </div>
            )}

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
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" />
                </svg>
              </span>
              <p>
                Switch tabs anytime — only <strong>one</strong> of Resume or
                Self-Description is needed to generate your plan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {reports.length > 0 && (
        <section className="recent-reports">
          <div className="recent-reports__header">
            <h2>My Recent Interview Plans</h2>
          </div>
          <ul className="reports-list">
            {reports.map((report) => {
              const tier =
                report.matchScore >= 80 ? "high" : report.matchScore >= 60 ? "mid" : "low";
              return (
                <li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <span className={`report-item__match-pill report-item__match-pill--${tier}`}>
                    {tier === "high" ? "Strong match" : tier === "mid" ? "Partial match" : "Low match"}
                  </span>

                  <div className="report-item__top">
                    <div>
                      <h3>{report.title || "Untitled Position"}</h3>
                      <p className="report-meta">
                        Generated on {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <ProgressRing value={report.matchScore} size={40} stroke={4} />
                  </div>

                  <div className="report-item__bottom">
                    <p className={`match-score score--${tier}`}>
                      Match Score: {report.matchScore}%
                    </p>
                    <div className="report-item__actions">
                      <button
                        type="button"
                        className="report-item__action-btn report-item__action-btn--view"
                        aria-label="View plan"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/interview/${report._id}`);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="report-item__action-btn report-item__action-btn--regen"
                        aria-label="Regenerate plan"
                        onClick={(e) => {
                          e.stopPropagation();
                       
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="23 4 23 10 17 10" />
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="report-item__action-btn report-item__action-btn--delete"
                        aria-label="Delete plan"
                        onClick={(e) => {
                          e.stopPropagation();
                        
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <footer className="page-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Help Center</a>
      </footer>

      {/* sticky CTA bar — replaces the old in-card footer */}
      <div className="sticky-cta">
        <div className="sticky-cta__inner">
          <span className="footer-info">
            AI-Powered Strategy Generation
            <span className="footer-info__divider" />
            Approx 30s
          </span>
          <button
            onClick={handleGenerateReport}
            className="generate-btn"
            disabled={!canGenerate}
          >
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
        {!canGenerate && (
          <p className="sticky-cta__helper">
            Add a job description and either a resume or self-description to continue
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;