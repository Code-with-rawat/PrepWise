import React, { useState, useEffect } from 'react'
import '../Style/interview.scss';
import { useInterview } from '../Hooks/useInterview';
import { useNavigate, useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral Questions', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]


const ProgressRing = ({ value, size = 80, stroke = 5 }) => {
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference
    const tier = value >= 80 ? 'high' : value >= 60 ? 'mid' : 'low'

    return (
        <span className={`progress-ring progress-ring--${tier}`} style={{ width: size, height: size }}>
            <svg width={size} height={size}>
                <circle className='progress-ring__track' cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
                <circle
                    className='progress-ring__value'
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <span className='progress-ring__label' style={{ fontSize: size * 0.22 }}>{value}%</span>
        </span>
    )
}

// ── Sub-components ──────────────────────────────────────────────────────────
const QuestionCard = ({ item, index, onOpen, isReviewed }) => {
    const [open, setOpen] = useState(false)
    const [answer, setAnswer] = useState('')

    const toggle = () => {
        setOpen(o => !o)
        if (!open) onOpen()
    }

    return (
        <div className={`question-card ${open ? 'is-open' : ''}`}>
            <button className='question-card__trigger' onClick={toggle}>
                <span className='question-card__index'>Q{index + 1}</span>
                <p className='question-card__text'>{item.question}</p>
                <span className='question-card__trailing'>
                    {isReviewed && !open && (
                        <svg className='reviewed-check' width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className='question-card__body'>
                    <div className='info-panel info-panel--intention'>
                        <p className='info-panel__label'>Interviewer's Intention</p>
                        <p>{item.intention}</p>
                    </div>
                    <div className='info-panel info-panel--answer'>
                        <p className='info-panel__label'>Model Answer</p>
                        <p>{item.answer}</p>
                    </div>
                    <div className='your-answer'>
                        <div className='your-answer__label'>
                            <span className='your-answer__title'>Your Answer</span>
                            <span className='your-answer__hint'>— practice writing your response</span>
                        </div>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder='Type your answer here to compare with the model above. Focus on a specific real example — situation, action, result…'
                            rows={5}
                        />
                        {answer.length > 20 && (
                            <p className='your-answer__saved'>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                Answer saved · Compare with the model answer above
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, doneTasks, onToggleTask }) => {
    const total = day.tasks.length
    const completed = day.tasks.filter((_, i) => doneTasks[`${day.day}-${i}`]).length
    const dayDone = completed === total
    const dayStarted = completed > 0

    return (
        <div className={`roadmap-day ${dayDone ? 'is-done' : dayStarted ? 'is-started' : ''}`}>
            <div className='roadmap-day__head'>
                <span className='roadmap-day__badge'>
                    <span className='day-label'>Day</span>
                    <span className='day-num'>{day.day}</span>
                </span>
                <div className='roadmap-day__title'>
                    <h3>{day.focus}</h3>
                    <p>{completed}/{total} tasks done</p>
                </div>
                {dayDone && (
                    <span className='roadmap-day__complete-tag'>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Complete
                    </span>
                )}
            </div>
            <ul className='roadmap-task-list'>
                {day.tasks.map((task, i) => {
                    const key = `${day.day}-${i}`
                    const done = !!doneTasks[key]
                    return (
                        <li key={i} className={`roadmap-task ${done ? 'is-done' : ''}`} onClick={() => onToggleTask(key)}>
                            <span className='roadmap-task__box'>
                                {done && (
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </span>
                            <span className='roadmap-task__text'>{task}</span>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

// ── Main Component ──────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [reviewed, setReviewed] = useState({}) // { "technical-0": true, ... }
    const [doneTasks, setDoneTasks] = useState({}) // { "1-0": true, ... }
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])

    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <h1>Analyzing your profile and building your interview strategy...</h1>
            </main>
        )
    }

    const markReviewed = (section, index) => {
        setReviewed(prev => ({ ...prev, [`${section}-${index}`]: true }))
    }

    const toggleTask = (key) => {
        setDoneTasks(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const techReviewedCount = report.technicalQuestions.filter((_, i) => reviewed[`technical-${i}`]).length
    const behavReviewedCount = report.behavioralQuestions.filter((_, i) => reviewed[`behavioral-${i}`]).length

    const allTaskKeys = report.preparationPlan.flatMap(day => day.tasks.map((_, i) => `${day.day}-${i}`))
    const doneTaskCount = allTaskKeys.filter(k => doneTasks[k]).length
    const daysCompleted = report.preparationPlan.filter(day =>
        day.tasks.every((_, i) => doneTasks[`${day.day}-${i}`])
    ).length

    const totalItems = report.technicalQuestions.length + report.behavioralQuestions.length + report.preparationPlan.length
    const totalDone = techReviewedCount + behavReviewedCount + daysCompleted
    const overallPct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

    const navCounts = {
        technical: { done: techReviewedCount, total: report.technicalQuestions.length },
        behavioral: { done: behavReviewedCount, total: report.behavioralQuestions.length },
        roadmap: { done: daysCompleted, total: report.preparationPlan.length },
    }

    const roadmapPct = allTaskKeys.length > 0 ? Math.round((doneTaskCount / allTaskKeys.length) * 100) : 0

    return (
        <div className='result-page'>
            {/* ── Top bar ── */}
            <div className='result-topbar'>
                <div className='result-topbar__left'>
                    <button className='result-back-btn' onClick={() => navigate(-1)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back
                    </button>
                    <span className='result-topbar__divider' />
                    <span className='result-status'>
                        <span className='result-status__dot' />
                        Strategy Ready
                    </span>
                </div>
                <div className='result-topbar__right'>
                    {report.title && <span className='result-role-label'>{report.title}</span>}
                    <button onClick={() => getResumePdf(interviewId)} className='download-report-btn'>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z" />
                        </svg>
                        Download Resume
                    </button>
                </div>
            </div>

            <div className='result-body'>

               
                <aside className='result-sidebar-left'>
                    <p className='result-sidebar-left__label'>Sections</p>
                    <nav className='result-nav'>
                        {NAV_ITEMS.map(item => {
                            const active = activeNav === item.id
                            const { done, total } = navCounts[item.id]
                            const complete = total > 0 && done === total
                            return (
                                <button
                                    key={item.id}
                                    className={`result-nav-item ${active ? 'is-active' : ''}`}
                                    onClick={() => setActiveNav(item.id)}
                                >
                                    <span className='result-nav-item__icon'>{item.icon}</span>
                                    <span className='result-nav-item__body'>
                                        <p className='result-nav-item__label'>{item.label}</p>
                                        <p className='result-nav-item__meta'>
                                            {item.id === 'roadmap' ? `${done}/${total} days done` : `${done}/${total} reviewed`}
                                        </p>
                                    </span>
                                    <span className='result-nav-item__status'>
                                        {complete ? (
                                            <svg className='is-complete' width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : done > 0 ? (
                                            <span className='is-progress' />
                                        ) : null}
                                    </span>
                                </button>
                            )
                        })}
                    </nav>

                    <div className='result-sidebar-left__footer'>
                        <div className='overall-progress-box'>
                            <p className='overall-progress-box__label'>Overall Progress</p>
                            <div className='overall-progress-box__row'>
                                <div className='overall-progress-box__track'>
                                    <div className='overall-progress-box__fill' style={{ width: `${overallPct}%` }} />
                                </div>
                                <span className='overall-progress-box__pct'>{overallPct}%</span>
                            </div>
                            <p className='overall-progress-box__hint'>Expand questions to mark reviewed</p>
                        </div>
                    </div>
                </aside>

                {/* ── Center Content ── */}
                <main className='result-main'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='result-main__header'>
                                <h2>Technical Questions</h2>
                                <p>Expand each question to see the interviewer's intent and a model answer, then practice your own response.</p>
                            </div>
                            <div className='question-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                        isReviewed={!!reviewed[`technical-${i}`]}
                                        onOpen={() => markReviewed('technical', i)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='result-main__header'>
                                <h2>Behavioral Questions</h2>
                                <p>Practice each story until it flows naturally under 3 minutes.</p>
                            </div>
                            <div className='question-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard
                                        key={i}
                                        item={q}
                                        index={i}
                                        isReviewed={!!reviewed[`behavioral-${i}`]}
                                        onOpen={() => markReviewed('behavioral', i)}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='roadmap-header'>
                                <div className='roadmap-header__top'>
                                    <div>
                                        <h2>Preparation Road Map</h2>
                                        <p>A structured daily plan to maximize your readiness. Check off tasks as you complete them.</p>
                                    </div>
                                    <div className='roadmap-header__pct'>
                                        <p className={`value ${roadmapPct >= 80 ? 'is-high' : roadmapPct >= 40 ? 'is-mid' : ''}`}>{roadmapPct}%</p>
                                        <p className='label'>complete</p>
                                    </div>
                                </div>
                                <div className='roadmap-header__track'>
                                    <div className={`roadmap-header__fill ${roadmapPct >= 80 ? 'is-high' : 'is-mid'}`} style={{ width: `${roadmapPct}%` }} />
                                </div>
                                <p className='roadmap-header__summary'>
                                    {doneTaskCount} of {allTaskKeys.length} tasks completed · {report.preparationPlan.length - daysCompleted} days remaining
                                </p>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} doneTasks={doneTasks} onToggleTask={toggleTask} />
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                
                <aside className='result-sidebar-right'>

               
                    <div className='sidebar-card'>
                        <p className='sidebar-card__label'>Match Score</p>
                        <div className='match-score-card'>
                            <ProgressRing value={report.matchScore} size={80} stroke={5} />
                            <div>
                                <p className='match-score-card__title'>
                                    {report.matchScore >= 80 ? 'Strong Match' : report.matchScore >= 60 ? 'Partial Match' : 'Needs Work'}
                                </p>
                                <p className='match-score-card__desc'>Your profile aligns well with this role's core requirements</p>
                            </div>
                        </div>
                    </div>

                    {activeNav !== 'roadmap' ? (
                        <>
                           
                            <div className='sidebar-card'>
                                <p className='sidebar-card__label'>Skill Gaps to Address</p>
                                <div className='skill-gap-tags'>
                                    {report.skillGaps.map((gap, i) => (
                                        <span key={i} className='skill-gap-tag'>{gap.skill}</span>
                                    ))}
                                </div>
                            </div>

                            
                            <div className='sidebar-card'>
                                <p className='sidebar-card__label'>
                                    {activeNav === 'technical' ? 'Technical' : 'Behavioral'} Review
                                </p>
                                {(activeNav === 'technical' ? report.technicalQuestions : report.behavioralQuestions).map((q, i) => {
                                    const isRev = !!reviewed[`${activeNav}-${i}`]
                                    return (
                                        <div key={i} className='review-checklist-item'>
                                            <span className={`review-checklist-item__box ${isRev ? 'is-reviewed' : ''}`}>
                                                {isRev && (
                                                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </span>
                                            <span className={`review-checklist-item__label ${isRev ? 'is-reviewed' : ''}`}>
                                                Q{i + 1} — {q.question.slice(0, 34)}…
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Days completed */}
                            <div className='sidebar-card'>
                                <p className='sidebar-card__label'>Days Completed</p>
                                {report.preparationPlan.map((day) => {
                                    const total = day.tasks.length
                                    const completed = day.tasks.filter((_, i) => doneTasks[`${day.day}-${i}`]).length
                                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0
                                    const done = completed === total
                                    const started = completed > 0
                                    return (
                                        <div key={day.day} className='day-progress-item'>
                                            <div className='day-progress-item__row'>
                                                <span className={`day-progress-item__label ${done ? 'is-done' : started ? 'is-started' : ''}`}>Day {day.day}</span>
                                                <span className={`day-progress-item__pct ${done ? 'is-done' : ''}`}>{pct}%</span>
                                            </div>
                                            <div className='day-progress-item__track'>
                                                <div className={`day-progress-item__fill ${done ? 'is-done' : started ? 'is-started' : ''}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Quick stats */}
                            <div className='sidebar-card'>
                                <p className='sidebar-card__label'>Quick Stats</p>
                                <div className='stat-row'>
                                    <span className='stat-row__left'>Tasks remaining</span>
                                    <span className='stat-row__value'>{allTaskKeys.length - doneTaskCount}</span>
                                </div>
                                <div className='stat-row'>
                                    <span className='stat-row__left'>Days complete</span>
                                    <span className={`stat-row__value ${daysCompleted > 0 ? 'is-high' : ''}`}>{daysCompleted}/{report.preparationPlan.length}</span>
                                </div>
                                <div className='stat-row'>
                                    <span className='stat-row__left'>Overall progress</span>
                                    <span className={`stat-row__value ${roadmapPct >= 80 ? 'is-high' : 'is-mid'}`}>{roadmapPct}%</span>
                                </div>
                            </div>
                        </>
                    )}
                </aside>
            </div>
        </div>
    )
}

export default Interview