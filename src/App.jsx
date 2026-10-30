import { useState, useEffect } from "react";
import "./App.css";

const agentInfo = [
  {
    name: "Shogun",
    icon: "👑",
    role: "Planning Agent",
    description: "Analyzes requirements and creates development plans."
  },
  {
    name: "Samurai",
    icon: "⚔️",
    role: "Developer Agent",
    description: "Writes code and implements requested features."
  },
  {
    name: "Sentinel",
    icon: "🛡️",
    role: "Testing Agent",
    description: "Runs tests and identifies errors."
  },
  {
    name: "Shadow Council",
    icon: "🔍",
    role: "Review Agent",
    description: "Reviews code quality and security."
  }
];

const statuses = ["Idle", "Working", "Completed", "Failed"];


const sampleChanges = [
  {
    filename: "src/App.jsx",
    additions: 3,
    deletions: 1,
    changes: [
      { type: "normal", text: "function App() {" },
      { type: "removed", text: '  const title = "Old App";' },
      { type: "added", text: '  const title = "DevPilot";' },
      { type: "added", text: '  const theme = "dark";' },
      { type: "added", text: '  console.log(theme);' },
      { type: "normal", text: "  return <h1>{title}</h1>;" },
      { type: "normal", text: "}" }
    ]
  },
  {
    filename: "src/utils.js",
    additions: 3,
    deletions: 1,
    changes: [
      {
        type: "removed",
        text: "export const greet = () => 'Hi';"
      },
      {
        type: "added",
        text: "export function greet(name) {"
      },
      {
        type: "added",
        text: "  return `Hello, ${name}!`;"
      },
      {
        type: "added",
        text: "}"
      }
    ]
  }
];


const sampleTests = [
  {
    id: 1,
    name: "Login Validation Test",
    file: "tests/test_login.py",
    status: "Passed",
    duration: "0.12s",
    details: "Login validation returned the expected result."
  },
  {
    id: 2,
    name: "User Registration Test",
    file: "tests/test_register.py",
    status: "Passed",
    duration: "0.25s",
    details: "User registration behaved as expected."
  },
  {
    id: 3,
    name: "Password Reset Test",
    file: "tests/test_password.py",
    status: "Failed",
    duration: "0.18s",
    details:
      "AssertionError: expected status code 200, received 500."
  },
  {
    id: 4,
    name: "API Response Test",
    file: "tests/test_api.py",
    status: "Passed",
    duration: "0.09s",
    details: "API returned the expected JSON response."
  }
];

const sampleReview = {
  mission: "Add dark mode to the website",
  reviewer: "Shadow Council",
  filesChanged: 2,

  checks: [
    {
      name: "Code Quality",
      result: "Passed",
      description: "Example code style check completed."
    },
    {
      name: "Security Inspection",
      result: "Passed",
      description: "Example secret inspection completed."
    },
    {
      name: "Automated Testing",
      result: "Needs Attention",
      description: "One example test requires investigation."
    }
  ],

  findings: [
    {
      severity: "Warning",
      message: "Investigate the failed test before merging."
    },
    {
      severity: "Info",
      message: "Consider improving keyboard accessibility."
    }
  ]
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mission, setMission] = useState("");
  const [submittedMission, setSubmittedMission] = useState("");
  const [activity, setActivity] = useState([]);

  const [agentStatuses, setAgentStatuses] = useState([
    "Idle", "Idle", "Idle", "Idle"
  ]);

  const [selectedAgent, setSelectedAgent] = useState(0);
  const [selectedFile, setSelectedFile] = useState(0);
  const [testFilter, setTestFilter] = useState("All");
  const [selectedTestId, setSelectedTestId] = useState(1);
  
  const [reviewDecision, setReviewDecision] =
    useState("Pending");

  const [reviewComment, setReviewComment] =
    useState("");


  // Load previously saved missions from the browser
  const [missions, setMissions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("devpilot-missions")) || [];
    } catch {
      return [];
    }
  });

  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [searchText, setSearchText] = useState("");

  const menuItems = [
    "Dashboard",
    "Missions",
    "AI Agents",
    "Code Changes",
    "Test Results",
    "Review"
  ];

  // Save missions whenever the history changes
  useEffect(() => {
    localStorage.setItem(
      "devpilot-missions",
      JSON.stringify(missions)
    );
  }, [missions]);

  function startMission() {
    if (!mission.trim()) {
      alert("Please enter a mission!");
      return;
    }

    const newMission = {
      id: crypto.randomUUID(),
      title: mission.trim(),
      date: new Date().toLocaleString(),
      status: "Awaiting backend"
    };

    setMissions((previous) => [newMission, ...previous]);
    setSelectedMissionId(newMission.id);
    setSubmittedMission(newMission.title);

    setActivity([
      {
        agent: "System",
        message: "Mission saved in frontend.",
        status: "Completed"
      },
      {
        agent: "System",
        message: "Waiting for backend integration.",
        status: "Waiting"
      }
    ]);

    setMission("");
  }

  function changeAgentStatus(index) {
    setAgentStatuses((previous) => {
      const updated = [...previous];
      const current = statuses.indexOf(updated[index]);

      updated[index] =
        statuses[(current + 1) % statuses.length];

      return updated;
    });
  }

  function resetAgents() {
    setAgentStatuses(["Idle", "Idle", "Idle", "Idle"]);
  }

  function deleteMission(id) {
    if (!window.confirm("Delete this mission from history?")) {
      return;
    }

    setMissions((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (selectedMissionId === id) {
      setSelectedMissionId(null);
    }
  }

  const filteredMissions = missions.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const selectedMission = missions.find(
    (item) => item.id === selectedMissionId
  );

  
const passedTests = sampleTests.filter(
  (test) => test.status === "Passed"
).length;

const failedTests = sampleTests.filter(
  (test) => test.status === "Failed"
).length;

const passPercentage =
  (passedTests / sampleTests.length) * 100;

const filteredTests = sampleTests.filter(
  (test) =>
    testFilter === "All" ||
    test.status === testFilter
);

const selectedTest = sampleTests.find(
  (test) => test.id === selectedTestId
);


function submitReview(decision) {
  if (reviewDecision !== "Pending") {
    return;
  }

  if (
    decision === "Rejected" &&
    reviewComment.trim() === ""
  ) {
    alert("Please enter a reason for rejection.");
    return;
  }

  setReviewDecision(decision);
}

function resetReview() {
  setReviewDecision("Pending");
  setReviewComment("");
}

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2>⚔️ DevPilot</h2>
        <p>AI Engineering Guild</p>

        <nav>
          {menuItems.map((item) => (
            <button
              key={item}
              className={
                activePage === item
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      
<main className="main-content">

  <div className="global-demo-banner">
    <span>🧪 Frontend Demo Mode</span>
    <p>
      AI agent execution is not connected yet.
      Agent statuses, code changes, tests, and
      review findings use demonstration data.
    </p>
  </div>

  <h1>{activePage}</h1>


        {/* Dashboard */}
        {activePage === "Dashboard" && (
          <>
            <p>Welcome to DevPilot AI Engineering Guild</p>

            <div className="mission">
              <h2>Start a New Mission</h2>

              <textarea
                placeholder="Enter your coding task..."
                value={mission}
                onChange={(e) => setMission(e.target.value)}
              />

              <button onClick={startMission}>
                Start Mission
              </button>
            </div>

            {submittedMission && (
              <div className="mission-result">
                <h2>✅ Mission Saved!</h2>
                <p>{submittedMission}</p>
                <p>Status: Awaiting backend</p>

                <button
                  className="agent-button"
                  onClick={() => setActivePage("Missions")}
                >
                  View Mission History
                </button>
              </div>
            )}

            <h2>Our AI Agents</h2>

            <div className="agents">
              {agentInfo.map((agent, index) => (
                <div className="agent" key={agent.name}>
                  <h3>{agent.icon} {agent.name}</h3>
                  <p>{agent.role}</p>
                  <p>Status: {agentStatuses[index]}</p>
                </div>
              ))}
            </div>

            <div className="activity-section">
              <h2>📋 Mission Activity</h2>

              {activity.length === 0 ? (
                <p>No activity yet.</p>
              ) : (
                activity.map((item, index) => (
                  <div className="activity-card" key={index}>
                    <h3>{item.agent}</h3>
                    <p>{item.message}</p>
                    <span>Status: {item.status}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Mission History */}
        {activePage === "Missions" && (
          <div className="history-page">
            <p>
              View your saved development requests.
            </p>

            <div className="demo-notice">
              Missions are stored in your browser.
              They have not been sent to the backend.
            </div>

            <input
              className="mission-search"
              type="text"
              placeholder="Search missions..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <h2>Saved Missions ({missions.length})</h2>

            {filteredMissions.length === 0 ? (
              <div className="placeholder-page">
                <p>
                  No matching missions found.
                  Create one from the Dashboard!
                </p>
              </div>
            ) : (
              <div className="mission-list">
                {filteredMissions.map((item) => (
                  <div className="history-card" key={item.id}>
                    <h3>{item.title}</h3>
                    <p>Created: {item.date}</p>
                    <p className="history-status">
                      Status: {item.status}
                    </p>

                    <button
                      className="agent-button"
                      onClick={() => setSelectedMissionId(item.id)}
                    >
                      View Details
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => deleteMission(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedMission && (
              <div className="mission-details">
                <h2>Mission Details</h2>
                <p><strong>Task:</strong> {selectedMission.title}</p>
                <p><strong>Created:</strong> {selectedMission.date}</p>
                <p><strong>Status:</strong> {selectedMission.status}</p>
                <p>
                  AI execution will be available
                  after backend integration.
                </p>
              </div>
            )}
          </div>
        )}

        {/* AI Agent Monitoring */}
        {activePage === "AI Agents" && (
          <div className="monitoring-page">
            <p>Monitor agent responsibilities and statuses.</p>

            <div className="demo-notice">
              Demo mode: Status changes are simulated.
              No AI agents are running yet.
            </div>

            <div className="agents monitoring-grid">
              {agentInfo.map((agent, index) => (
                <div className="agent monitor-card" key={agent.name}>
                  <h2>{agent.icon} {agent.name}</h2>
                  <p>{agent.role}</p>

                  <span
                    className={`status-label ${agentStatuses[index].toLowerCase()}`}
                  >
                    ● {agentStatuses[index]}
                  </span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width:
                          agentStatuses[index] === "Completed"
                            ? "100%"
                            : agentStatuses[index] === "Working"
                            ? "50%"
                            : "0%"
                      }}
                    ></div>
                  </div>

                  <button
                    className="agent-button"
                    onClick={() => setSelectedAgent(index)}
                  >
                    View Details
                  </button>

                  <button
                    className="demo-button"
                    onClick={() => changeAgentStatus(index)}
                  >
                    Next Demo Status
                  </button>
                </div>
              ))}
            </div>

            <button
              className="reset-button"
              onClick={resetAgents}
            >
              Reset Demo Statuses
            </button>

            <div className="agent-details">
              <h2>Agent Details</h2>
              <h3>
                {agentInfo[selectedAgent].icon}{" "}
                {agentInfo[selectedAgent].name}
              </h3>
              <p>
                <strong>Role:</strong>{" "}
                {agentInfo[selectedAgent].role}
              </p>
              <p>{agentInfo[selectedAgent].description}</p>
              <p>
                <strong>Demo Status:</strong>{" "}
                {agentStatuses[selectedAgent]}
              </p>
            </div>
          </div>
        )}

{/* Code Changes Viewer */}
{activePage === "Code Changes" && (
  <div className="code-page">

    <p>
      Review code modifications proposed by the Samurai agent.
    </p>

    <div className="demo-notice">
      Demo mode: These are sample changes only.
      No actual project files have been modified.
    </div>

    <div className="code-summary">
      <div className="summary-card">
        <h2>{sampleChanges.length}</h2>
        <p>Files Changed</p>
      </div>

      <div className="summary-card">
        <h2 className="added-text">
          +{sampleChanges.reduce(
            (sum, file) => sum + file.additions, 0
          )}
        </h2>
        <p>Lines Added</p>
      </div>

      <div className="summary-card">
        <h2 className="removed-text">
          -{sampleChanges.reduce(
            (sum, file) => sum + file.deletions, 0
          )}
        </h2>
        <p>Lines Removed</p>
      </div>
    </div>

    <h2>Changed Files</h2>

    <div className="changed-files">
      {sampleChanges.map((file, index) => (
        <button
          key={file.filename}
          className={
            selectedFile === index
              ? "file-button selected"
              : "file-button"
          }
          onClick={() => setSelectedFile(index)}
        >
          <span>📄 {file.filename}</span>

          <span>
            <span className="added-text">
              +{file.additions}
            </span>
            {" "}
            <span className="removed-text">
              -{file.deletions}
            </span>
          </span>
        </button>
      ))}
    </div>

    <div className="code-viewer">
      <h3>
        📄 {sampleChanges[selectedFile].filename}
      </h3>

      <div className="code-lines">
        {sampleChanges[selectedFile].changes.map(
          (line, index) => (
            <div
              key={index}
              className={`code-line ${line.type}`}
            >
              <span className="line-number">
                {index + 1}
              </span>

              <span className="line-symbol">
                {line.type === "added"
                  ? "+"
                  : line.type === "removed"
                  ? "-"
                  : " "}
              </span>

              <code>{line.text}</code>
            </div>
          )
        )}
      </div>
    </div>

  </div>
)}


{/* Test Results Dashboard */}
{activePage === "Test Results" && (
  <div className="test-page">

    <p>Monitor test results from the Sentinel agent.</p>

    <div className="demo-notice">
      Demo Mode: These are example test results.
      No automated tests have been executed.
    </div>

    {/* Summary Cards */}
    <div className="test-summary">

      <div className="test-stat">
        <h2>{sampleTests.length}</h2>
        <p>Total Tests</p>
      </div>

      <div className="test-stat">
        <h2 className="test-green">{passedTests}</h2>
        <p>Passed</p>
      </div>

      <div className="test-stat">
        <h2 className="test-red">{failedTests}</h2>
        <p>Failed</p>
      </div>

    </div>

    {/* Progress Bar */}
    <div className="test-progress-section">
      <h2>Test Summary</h2>

      <p>
        {passedTests} of {sampleTests.length} tests passed
        (sample data)
      </p>

      <div className="test-progress">
        <div
          className="test-progress-fill"
          style={{ width: `${passPercentage}%` }}
        ></div>
      </div>
    </div>

    {/* Filter Buttons */}
    <h2>Test Cases</h2>

    <div className="test-filters">
      {["All", "Passed", "Failed"].map((filter) => (
        <button
          key={filter}
          className={
            testFilter === filter
              ? "test-filter active"
              : "test-filter"
          }
          onClick={() => setTestFilter(filter)}
        >
          {filter}
        </button>
      ))}
    </div>

    {/* Test List */}
    <div className="test-list">
      {filteredTests.map((test) => (
        <div className="test-card" key={test.id}>

          <div className="test-card-header">
            <h3>{test.name}</h3>

            <span
              className={
                test.status === "Passed"
                  ? "test-green"
                  : "test-red"
              }
            >
              {test.status === "Passed" ? "✅" : "❌"}
              {" "}
              {test.status}
            </span>
          </div>

          <p>File: {test.file}</p>
          <p>Example duration: {test.duration}</p>

          <button
            className="test-details-button"
            onClick={() => setSelectedTestId(test.id)}
          >
            View Details
          </button>

        </div>
      ))}
    </div>

    {/* Selected Test Details */}
    {selectedTest && (
      <div className="test-details">
        <h2>Test Details</h2>

        <h3>{selectedTest.name}</h3>

        <p>
          <strong>File:</strong> {selectedTest.file}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {selectedTest.status}
        </p>

        <p>
          <strong>Result:</strong>
        </p>

        <pre className="test-output">
          {selectedTest.details}
        </pre>
      </div>
    )}

    {/* Feedback Loop Example */}
    <div className="feedback-panel">
      <h2>🔁 Example Feedback Loop</h2>

      <p>
        1. Sentinel detects a failing test.
      </p>

      <p>
        2. The failure is reported to Samurai.
      </p>

      <p>
        3. Samurai investigates and proposes a repair.
      </p>

      <p>
        4. Sentinel reruns the affected tests.
      </p>

      <p className="feedback-note">
        This is an example workflow, not a real
        agent execution.
      </p>
    </div>

  </div>
)}


{/* Human Approval and Code Review */}
{activePage === "Review" && (
  <div className="review-page">

    <p>
      Review proposed changes before they are applied.
    </p>

    <div className="demo-notice">
      Demo Mode: All review findings are sample data.
      Buttons do not modify any real code.
    </div>

    {/* Proposed Mission */}
    <div className="review-card">
      <h2>📋 Proposed Changes</h2>

      <p>
        <strong>Mission:</strong> {sampleReview.mission}
      </p>

      <p>
        <strong>Reviewer:</strong> {sampleReview.reviewer}
      </p>

      <p>
        <strong>Files Changed:</strong>{" "}
        {sampleReview.filesChanged}
      </p>

      <p>
        <strong>Decision:</strong>{" "}
        <span className="review-status">
          {reviewDecision}
        </span>
      </p>

      <button
        className="agent-button"
        onClick={() => setActivePage("Code Changes")}
      >
        View Code Changes
      </button>
    </div>

    {/* Review Checklist */}
    <div className="review-card">
      <h2>🛡️ Review Checklist</h2>

      {sampleReview.checks.map((check) => (
        <div className="review-check" key={check.name}>
          <div>
            <h3>{check.name}</h3>
            <p>{check.description}</p>
          </div>

          <span
            className={
              check.result === "Passed"
                ? "review-pass"
                : "review-warning"
            }
          >
            {check.result === "Passed" ? "✅" : "⚠️"}
            {" "}
            {check.result}
          </span>
        </div>
      ))}
    </div>

    {/* Findings */}
    <div className="review-card">
      <h2>🔍 Review Findings</h2>

      {sampleReview.findings.map((finding, index) => (
        <div className="review-finding" key={index}>
          <strong>{finding.severity}</strong>
          <p>{finding.message}</p>
        </div>
      ))}
    </div>

    {/* Human Approval */}
    <div className="review-card">
      <h2>👤 Human Approval</h2>

      <p>
        Examine the proposed changes and review findings
        before making a decision.
      </p>

      <label htmlFor="review-comment">
        Review Comment
      </label>

      <textarea
        id="review-comment"
        placeholder="Enter your review comments..."
        value={reviewComment}
        onChange={(e) =>
          setReviewComment(e.target.value)
        }
        disabled={reviewDecision !== "Pending"}
      />

      <div className="review-actions">
        <button
          className="approve-button"
          disabled={reviewDecision !== "Pending"}
          onClick={() => submitReview("Approved")}
        >
          ✅ Approve (Demo)
        </button>

        <button
          className="reject-button"
          disabled={reviewDecision !== "Pending"}
          onClick={() => submitReview("Rejected")}
        >
          ❌ Reject (Demo)
        </button>
      </div>

      {reviewDecision !== "Pending" && (
        <div className="review-result">
          <h3>
            Decision Recorded: {reviewDecision}
          </h3>

          <p>
            <strong>Comment:</strong>{" "}
            {reviewComment || "No comment provided."}
          </p>

          <p>
            This is a frontend demonstration only.
            No code has been applied or merged.
          </p>
        </div>
      )}

      <button
        className="reset-button"
        onClick={resetReview}
      >
        Reset Review Demo
      </button>
    </div>

  </div>
)}

        {/* Remaining pages */}
        {!["Dashboard", "Missions", "AI Agents", "Code Changes", "Test Results", "Review"].includes(activePage) && (
          <div className="placeholder-page">
            <h2>{activePage}</h2>
            <p>This section will be developed next.</p>
            <p>Backend integration is not required yet.</p>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;