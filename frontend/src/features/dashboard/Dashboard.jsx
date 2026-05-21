import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  FileText, Upload, Brain, LogOut, ChevronRight, CheckCircle, 
  AlertCircle, BookOpen, MessageSquare, AlertTriangle, ArrowLeft,
  Sparkles, Calendar, Badge, User, Loader2, RefreshCw
} from 'lucide-react';
import api, { setAccessToken } from '../../utils/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  
  // Form states
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('skills'); // skills, plan, qa
  const [expandedAnswer, setExpandedAnswer] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // Check auth
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      setUser({ email: storedUser });
    }

    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.error('Failed to fetch user profile', err);
      }
    };

    fetchUserProfile();
    fetchReports();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const response = await api.get('/api/reports');
      if (response.data?.reports) {
        setReports(response.data.reports);
      }
    } catch (err) {
      console.error('Failed to fetch reports', err);
    }
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError('');
      } else {
        setError("Only PDF files are supported.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError('');
      } else {
        setError("Only PDF files are supported.");
      }
    }
  };

  // Form submission to generate report
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a resume (PDF).');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a Job Description.');
      return;
    }

    setLoading(true);
    setError('');
    setProgressStep(1); // Uploading & parsing

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    // Simulate progress updates for premium feel
    const progressTimer1 = setTimeout(() => setProgressStep(2), 2500); // AI Analysis
    const progressTimer2 = setTimeout(() => setProgressStep(3), 5500); // Finalizing Plan

    try {
      const response = await api.post('/api/generatereport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      
      const newReport = response.data?.savedReport;
      if (newReport) {
        setReports(prev => [newReport, ...prev]);
        setActiveReport(newReport);
        // Reset form
        setFile(null);
        setJobDescription('');
      }
    } catch (err) {
      clearTimeout(progressTimer1);
      clearTimeout(progressTimer2);
      setError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
      setProgressStep(0);
    }
  };

  const toggleAnswer = (id) => {
    setExpandedAnswer(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Match score color mapper
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/5';
  };

  const getScoreCircleColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-300';
      case 'Medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-300';
      case 'Low':
        return 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 flex flex-col font-outfit">
      {/* Background radial effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-violet-600/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[150px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Resume <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Analyzer</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-300">
              <User className="w-4 h-4 text-violet-400" />
              <span>{user?.name || user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-rose-400 transition-all cursor-pointer flex items-center gap-2 text-sm px-3"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Report History */}
        <section className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-4 flex flex-col h-[400px] lg:h-[calc(100vh-12rem)] sticky top-24">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-400" />
                History
              </h3>
              <span className="text-xs px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full text-slate-400 font-mono">
                {reports.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <button
                onClick={() => setActiveReport(null)}
                className={`w-full text-left p-3 rounded-xl border transition-all text-sm flex items-center gap-3 cursor-pointer ${
                  activeReport === null 
                    ? 'bg-violet-600/10 border-violet-500/35 text-white font-medium' 
                    : 'bg-[#11161d] border-slate-900 hover:border-slate-800 text-slate-300'
                }`}
              >
                <Upload className="w-4 h-4 shrink-0 text-violet-400" />
                <span>New Analysis</span>
              </button>

              {reports.map((report) => {
                const date = new Date(report.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                return (
                  <button
                    key={report._id}
                    onClick={() => setActiveReport(report)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      activeReport?._id === report._id
                        ? 'bg-violet-600/10 border-violet-500/35 text-white font-medium shadow-md shadow-violet-950/10'
                        : 'bg-[#11161d] border-slate-900 hover:border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {date}
                      </span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md border ${getScoreColor(report.matchscore)}`}>
                        {report.matchscore}%
                      </span>
                    </div>
                    <p className="text-xs truncate text-slate-300">
                      {report.jobDescription || "Job Analysis"}
                    </p>
                  </button>
                );
              })}

              {reports.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-xs px-4">
                  <Brain className="w-8 h-8 opacity-20 mb-2" />
                  <p>No reports generated yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="flex-1 min-w-0">
          
          {/* Active: New Upload Form */}
          {activeReport === null ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                  Analyze Your Resume
                </h2>
                <p className="text-slate-400 text-sm">
                  Upload your CV in PDF format and paste the job description to get instant score gap reports and a structured 14-day study plan.
                </p>
              </div>

              {error && (
                <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-200 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* PDF Drag-and-Drop Zone */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
                    Resume (PDF Format)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden ${
                      dragActive 
                        ? 'border-violet-500 bg-violet-600/5' 
                        : 'border-slate-800 bg-[#11161d] hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      id="resume-file-input"
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                          <FileText className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-semibold text-white max-w-[250px] truncate">{file.name}</p>
                        <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFile(null);
                          }}
                          className="mt-4 text-xs font-medium text-rose-400 hover:text-rose-300 underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3 group-hover:text-slate-300">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-slate-300">
                          Drag and drop your resume here, or <span className="text-violet-400 hover:text-violet-300 underline">browse</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-2">Only PDF documents up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-3">
                    Job Description
                  </label>
                  <textarea
                    rows="6"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the target job description or key requirements here to check match scores and skill gaps..."
                    className="w-full p-4 bg-[#11161d] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all text-sm resize-y"
                    required
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-2xl shadow-lg shadow-violet-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Brain className="w-5 h-5" />
                  Analyze and Build Preparation Guide
                </button>
              </form>

              {/* Generating overlay spinner */}
              {loading && (
                <div className="absolute inset-0 bg-[#07090c]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border border-violet-500/10 flex items-center justify-center">
                      <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
                    </div>
                    <div className="absolute inset-0 w-20 h-20 rounded-full border border-t-2 border-violet-500 animate-spin pointer-events-none" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">Analyzing Resume</h3>
                  
                  {/* Custom progress stepper */}
                  <div className="w-full max-w-xs space-y-3 mt-4">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                        progressStep >= 1 ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-slate-800 text-slate-600'
                      }`}>
                        {progressStep > 1 ? '✓' : '1'}
                      </span>
                      <span className={progressStep >= 1 ? 'text-slate-200' : ''}>Reading resume & job details</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                        progressStep >= 2 ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-slate-800 text-slate-600'
                      }`}>
                        {progressStep > 2 ? '✓' : '2'}
                      </span>
                      <span className={progressStep >= 2 ? 'text-slate-200' : ''}>Comparing keywords with Gemini</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${
                        progressStep >= 3 ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-slate-800 text-slate-600'
                      }`}>
                        3
                      </span>
                      <span className={progressStep >= 3 ? 'text-slate-200' : ''}>Building customized preparation plan</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            
            /* Active: Report Detailed View */
            <div className="flex flex-col gap-6">
              
              {/* Back to upload button */}
              <div>
                <button
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-2 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Analyze Another Resume
                </button>
              </div>

              {/* Report Header Card */}
              <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between border border-slate-900 relative overflow-hidden">
                <div className="absolute top-[-50%] left-[-5%] w-[40%] h-[150%] rounded-full bg-violet-500/5 blur-[80px]" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400">
                      AI Generated Analysis
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white truncate max-w-lg mb-2">
                    {activeReport.jobDescription || "Job Preparation Plan"}
                  </h2>
                  <p className="text-slate-400 text-xs flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    Generated on {new Date(activeReport.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>

                {/* SVG circular score indicator */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="relative flex items-center justify-center w-24 h-24">
                    {/* SVG Progress Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        stroke={getScoreCircleColor(activeReport.matchscore)}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 38}`}
                        strokeDashoffset={`${2 * Math.PI * 38 * (1 - activeReport.matchscore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xl font-bold text-white font-mono">
                      {activeReport.matchscore}%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                    Match Score
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-900 gap-1.5 p-1 bg-slate-950/40 rounded-xl">
                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'skills'
                      ? 'bg-slate-900 border border-slate-800 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-violet-400" />
                  Skills Gap
                </button>
                
                <button
                  onClick={() => setActiveTab('plan')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'plan'
                      ? 'bg-slate-900 border border-slate-800 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-violet-400" />
                  Study Plan
                </button>

                <button
                  onClick={() => setActiveTab('qa')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'qa'
                      ? 'bg-slate-900 border border-slate-800 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-violet-400" />
                  Interview Q&A
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="glass-panel rounded-3xl p-6 min-h-[300px]">
                
                {/* 1. Skills Gap */}
                {activeTab === 'skills' && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      Missing Skills & Severity
                    </h3>
                    <p className="text-slate-400 text-xs mb-6">
                      Below are critical skills identified from the job description that were missing or not emphasized in your resume. Use this list to tailor your resume update.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeReport.skillsGap?.map((gap, index) => (
                        <div 
                          key={index}
                          className="p-4 bg-[#11161d] border border-slate-900 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                            <span className="text-sm font-semibold text-white">{gap.skill}</span>
                          </div>
                          
                          <span className={`text-xs font-semibold px-2 py-0.5 border rounded-full shrink-0 ${getSeverityStyles(gap.severity)}`}>
                            {gap.severity} Priority
                          </span>
                        </div>
                      ))}

                      {(!activeReport.skillsGap || activeReport.skillsGap.length === 0) && (
                        <div className="col-span-2 py-12 text-center text-slate-500 flex flex-col items-center">
                          <CheckCircle className="w-10 h-10 text-emerald-500 mb-2 opacity-50" />
                          <p>Fantastic! No significant skill gaps were detected.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Day-Wise Plan */}
                {activeTab === 'plan' && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                      chronological Interview Prep Road Map
                    </h3>
                    <p className="text-slate-400 text-xs mb-6">
                      A personalized, day-by-day roadmap targeting the requirements of this role based on your current skill sets.
                    </p>

                    <div className="relative border-l border-slate-800 pl-6 ml-4 space-y-6">
                      {activeReport.dayWisePlan?.map((plan, index) => (
                        <div key={index} className="relative">
                          {/* Timeline node icon */}
                          <div className="absolute top-0.5 left-[-35px] w-[18px] h-[18px] rounded-full border-4 border-[#07090c] bg-violet-500 flex items-center justify-center shadow-sm" />
                          
                          <div className="p-4 bg-[#11161d] border border-slate-900 rounded-xl">
                            <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wide">
                              Day {plan.day}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-1 mb-2">{plan.topic}</h4>
                            
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {Array.isArray(plan.subtopics) ? (
                                plan.subtopics.map((sub, i) => (
                                  <span 
                                    key={i} 
                                    className="text-[11px] px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-slate-400"
                                  >
                                    {sub}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-slate-400">
                                  {plan.subtopics}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {(!activeReport.dayWisePlan || activeReport.dayWisePlan.length === 0) && (
                        <div className="py-12 text-center text-slate-500">
                          <p>No study plan could be generated.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Interview Q&As */}
                {activeTab === 'qa' && (
                  <div className="space-y-8">
                    
                    {/* Technical section */}
                    <div>
                      <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 rounded-full bg-violet-500 shrink-0" />
                        Technical Interview Practice
                      </h3>

                      <div className="space-y-4">
                        {activeReport.technicalQuestions?.map((qa, index) => {
                          const qaId = `tech-${index}`;
                          const isOpen = expandedAnswer[qaId];
                          return (
                            <div 
                              key={index}
                              className="border border-slate-900 bg-[#11161d] rounded-xl overflow-hidden"
                            >
                              <button
                                onClick={() => toggleAnswer(qaId)}
                                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#151b24] transition-all cursor-pointer"
                              >
                                <span className="text-sm font-semibold text-slate-200">
                                  Q{index + 1}: {qa.question}
                                </span>
                                <ChevronRight className={`w-5 h-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                              </button>

                              {isOpen && (
                                <div className="p-4 bg-slate-950/50 border-t border-slate-900 text-xs text-slate-300 leading-relaxed font-sans">
                                  <span className="font-bold text-violet-400 block mb-1">Recommended Response:</span>
                                  {qa.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Behavioral section */}
                    <div>
                      <h3 className="text-base font-bold text-white mb-4 pb-2 border-b border-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-4 rounded-full bg-indigo-500 shrink-0" />
                        Behavioral Interview Practice
                      </h3>

                      <div className="space-y-4">
                        {activeReport.behavioralQuestions?.map((qa, index) => {
                          const qaId = `behavioral-${index}`;
                          const isOpen = expandedAnswer[qaId];
                          return (
                            <div 
                              key={index}
                              className="border border-slate-900 bg-[#11161d] rounded-xl overflow-hidden"
                            >
                              <button
                                onClick={() => toggleAnswer(qaId)}
                                className="w-full text-left p-4 flex items-center justify-between gap-4 hover:bg-[#151b24] transition-all cursor-pointer"
                              >
                                <span className="text-sm font-semibold text-slate-200">
                                  Q{index + 1}: {qa.question}
                                </span>
                                <ChevronRight className={`w-5 h-5 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                              </button>

                              {isOpen && (
                                <div className="p-4 bg-slate-950/50 border-t border-slate-900 text-xs text-slate-300 leading-relaxed font-sans">
                                  <span className="font-bold text-indigo-400 block mb-1">Recommended Answer Strategy (STAR Method):</span>
                                  {qa.answer}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

        </section>

      </main>
    </div>
  );
};

export default Dashboard;
