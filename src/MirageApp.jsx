/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'mirage_homepage_onboarding_v5';

const INITIAL_STATE = {
  clientName: '',
  companyName: '',
  email: '',
  website: '',
  projectType: '',
  budget: '150000',
  timeline: '',
  autonomyLevel: 'read',
  plugins: ['sec-shield'],
  termsAccepted: false
};

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState(INITIAL_STATE);

  const [dirtyFields, setDirtyFields] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport width dynamically
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 580);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Restore state from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const state = JSON.parse(stored);
        if (state.formData && typeof state.formData === 'object') {
          setFormData({
            ...INITIAL_STATE,
            ...state.formData,
            // Guard against legacy caches where plugins is missing or not an array
            plugins: Array.isArray(state.formData.plugins) ? state.formData.plugins : INITIAL_STATE.plugins
          });
        }
        setCurrentStep(state.currentStep || 1);
        setIsStarted(state.isStarted || false);
      } catch (e) {
        console.warn("Storage restore error:", e);
      }
    }
  }, []);


  const handleFormChange = (fields) => {
    const updated = { ...formData, ...fields };
    setFormData(updated);
    saveState(updated, currentStep, isStarted);
  };

  const saveState = (form, step, started) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: form, currentStep: step, isStarted: started }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'termsAccepted') {
        handleFormChange({ termsAccepted: checked });
      } else {
        const currentPlugins = [...formData.plugins];
        if (checked) {
          if (!currentPlugins.includes(value)) currentPlugins.push(value);
        } else {
          const idx = currentPlugins.indexOf(value);
          if (idx > -1) currentPlugins.splice(idx, 1);
        }
        handleFormChange({ plugins: currentPlugins });
      }
    } else {
      handleFormChange({ [name]: value });
    }
  };

  const handleFieldBlur = (e) => {
    const { name } = e.target;
    setDirtyFields(prev => ({ ...prev, [name]: true }));
  };

  const nextStep = () => {
    const panel = document.getElementById(`panel-step-${currentStep}`);
    const inputs = panel ? panel.querySelectorAll('input, select') : [];
    let allValid = true;
    const newDirty = { ...dirtyFields };

    inputs.forEach(input => {
      newDirty[input.name] = true;
      if (!input.checkValidity()) {
        allValid = false;
        input.classList.add('field-invalid-state');
      } else {
        input.classList.remove('field-invalid-state');
      }
    });

    setDirtyFields(newDirty);

    if (allValid) {
      const next = currentStep + 1;
      setCurrentStep(next);
      saveState(formData, next, isStarted);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      saveState(formData, prev, isStarted);
    }
  };

  const handleTabClick = (stepTarget) => {
    if (stepTarget < currentStep) {
      setCurrentStep(stepTarget);
      saveState(formData, stepTarget, isStarted);
    }
  };

  const startOnboarding = () => {
    setIsStarted(true);
    saveState(formData, currentStep, true);
  };

  const exitOnboarding = () => {
    setIsStarted(false);
    saveState(formData, currentStep, false);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    
    // Validate all inputs in the current active form
    const formEl = e.currentTarget;
    const inputs = formEl ? formEl.querySelectorAll('input, select') : [];
    let allValid = true;
    const newDirty = { ...dirtyFields };

    inputs.forEach(input => {
      newDirty[input.name] = true;
      if (!input.checkValidity()) {
        allValid = false;
        input.classList.add('field-invalid-state');
      } else {
        input.classList.remove('field-invalid-state');
      }
    });

    setDirtyFields(newDirty);

    if (!formData.termsAccepted) {
      setDirtyFields(prev => ({ ...prev, termsAccepted: true }));
      return;
    }

    if (allValid) {
      setDialogOpen(true);
      localStorage.removeItem(STORAGE_KEY);
    }
  };


  const closeDialog = () => {
    setDialogOpen(false);
    setFormData({
      clientName: '',
      companyName: '',
      email: '',
      website: '',
      projectType: '',
      budget: '150000',
      timeline: '',
      autonomyLevel: 'read',
      plugins: ['sec-shield'],
      termsAccepted: false
    });
    setDirtyFields({});
    setCurrentStep(1);
    setIsStarted(false);
  };

  const isFieldInvalid = (name, id) => {
    if (!dirtyFields[name]) return false;
    const el = document.getElementById(id);
    return el ? !el.checkValidity() : false;
  };

  return (
    <div className="app-viewport">
      <div className="subtle-glow-bg" />
      
      {/* 1. BRAND HOMEPAGE DECK (Minimalist Hero layout) */}
      {!isStarted && (
        <section className="brand-homepage-deck">
          <div className="hero-logo-container">
            <div className="logo-ring-outer" />
            <div className="logo-ring-inner" />
            <div className="logo-ring-pulse" />
            <img src="/logo.webp" alt="Mirage Symbol" className="hero-logo" />
          </div>
          
          <div className="hero-descriptors-row">
            <span>ENGINEERING SYNDICATE</span>
            <span className="bullet-sep">/</span>
            <span>SYSTEM DESIGN</span>
            <span className="bullet-sep">/</span>
            <span>DYNAMIC CODES</span>
          </div>


          <p className="hero-mission-statement">
            Architecting next-generation autonomous pipelines and ultra-high-fidelity minimalist digital workspaces.
          </p>

          <div className="hero-action-buttons">
            <button className="btn-homepage-primary" onClick={startOnboarding}>
              CONNECT CLIENT NODE
            </button>
          </div>
        </section>
      )}

      {/* 2. MOBILE SINGLE-SCREEN DECK */}
      {isStarted && isMobile && (
        <main className="form-card-container">
          <header className="brand-header">
            <div className="logo-halo-wrapper" onClick={exitOnboarding} style={{ cursor: 'pointer' }} title="Return to Homepage">
              <img src="/logo.webp" alt="Mirage Core Logo" className="brand-logo" />
            </div>
            <h1 className="brand-title">MIRAGE</h1>
            <p className="brand-tagline">MOBILE CORE CONSOLE</p>
          </header>

          <div className="form-viewport-body">
            <form onSubmit={handleSubmitForm} noValidate>
              <div className="panel-header">
                <h2>Mobile Core Sync</h2>
                <p>Register Operator Node parameters on a single sheet.</p>
              </div>

              <div className="input-fields-stack">
                {/* Operator Name */}
                <div className="input-field-group">
                  <label htmlFor="client-name-mob" className="field-label">Representative Name</label>
                  <input 
                    type="text" 
                    id="client-name-mob" 
                    name="clientName" 
                    required 
                    minLength={2} 
                    placeholder="Elena Rostova"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={dirtyFields.clientName ? (isFieldInvalid('clientName', 'client-name-mob') ? 'field-invalid-state' : 'field-valid-state') : ''}
                  />
                  {isFieldInvalid('clientName', 'client-name-mob') && (
                    <span className="error-tip-msg">Representative name must be at least 2 characters.</span>
                  )}
                </div>

                {/* Faction */}
                <div className="input-field-group">
                  <label htmlFor="company-name-mob" className="field-label">Company Faction</label>
                  <input 
                    type="text" 
                    id="company-name-mob" 
                    name="companyName" 
                    required 
                    minLength={2} 
                    placeholder="Cyberdyne Laboratories"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={dirtyFields.companyName ? (isFieldInvalid('companyName', 'company-name-mob') ? 'field-invalid-state' : 'field-valid-state') : ''}
                  />
                  {isFieldInvalid('companyName', 'company-name-mob') && (
                    <span className="error-tip-msg">Company faction identification is required.</span>
                  )}
                </div>

                {/* Email */}
                <div className="input-field-group">
                  <label htmlFor="email-mob" className="field-label">Communication Node (Email)</label>
                  <input 
                    type="email" 
                    id="email-mob" 
                    name="email" 
                    required 
                    placeholder="operator@mirage.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={dirtyFields.email ? (isFieldInvalid('email', 'email-mob') ? 'field-invalid-state' : 'field-valid-state') : ''}
                  />
                  {isFieldInvalid('email', 'email-mob') && (
                    <span className="error-tip-msg">Please enter a valid communications link email.</span>
                  )}
                </div>

                {/* Objective Select */}
                <div className="input-field-group">
                  <label htmlFor="project-type-mob" className="field-label">Directive Objective</label>
                  <select 
                    id="project-type-mob" 
                    name="projectType" 
                    required
                    value={formData.projectType}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={dirtyFields.projectType ? (isFieldInvalid('projectType', 'project-type-mob') ? 'field-invalid-state' : 'field-valid-state') : ''}
                  >
                    <option value="" disabled>Select Directive</option>
                    <option value="autonomous-robots">Autonomous Robotics Pipeline</option>
                    <option value="neural-nexus">Neural Nexus Models</option>
                    <option value="cyber-interface">Advanced Web Terminals</option>
                    <option value="sensor-array">Hardware/IoT Networks</option>
                  </select>
                  {isFieldInvalid('projectType', 'project-type-mob') && (
                    <span className="error-tip-msg">Directive objective target selection is required.</span>
                  )}
                </div>

                {/* Credit Allocation Slider */}
                <div className="input-field-group">
                  <label htmlFor="budget-tier-mob" className="field-label">Credit Allocation</label>
                  <div className="premium-range-controller">
                    <div className="range-labels">
                      <span>$25k</span>
                      <span className="active-value">
                        {parseInt(formData.budget) >= 500000 ? '$500k+ (Max)' : `$${(parseInt(formData.budget)/1000).toFixed(0)}k`}
                      </span>
                      <span>$500k+</span>
                    </div>
                    <input 
                      type="range" 
                      id="budget-tier-mob" 
                      name="budget" 
                      min="25000" 
                      max="500000" 
                      step="25000" 
                      value={formData.budget}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Launch Window Select */}
                <div className="input-field-group">
                  <label htmlFor="timeline-mob" className="field-label">Critical Launch Window</label>
                  <select 
                    id="timeline-mob" 
                    name="timeline" 
                    required
                    value={formData.timeline}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={dirtyFields.timeline ? (isFieldInvalid('timeline', 'timeline-mob') ? 'field-invalid-state' : 'field-valid-state') : ''}
                  >
                    <option value="" disabled>Select Window</option>
                    <option value="immediate">Immediate (&lt; 30 Days)</option>
                    <option value="q1">Alpha Core (60 - 90 Days)</option>
                    <option value="q2">Systematic Build (90 - 180 Days)</option>
                    <option value="backlog">Long-Range (180+ Days)</option>
                  </select>
                  {isFieldInvalid('timeline', 'timeline-mob') && (
                    <span className="error-tip-msg">Launch window configuration selection is required.</span>
                  )}
                </div>

                {/* Autonomy Level Selection */}
                <div className="input-field-group">
                  <label htmlFor="autonomy-level-mob" className="field-label">Mainframe Autonomy Level</label>
                  <select 
                    id="autonomy-level-mob" 
                    name="autonomyLevel" 
                    required
                    value={formData.autonomyLevel}
                    onChange={handleInputChange}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="read">Co-Pilot (Read-Only)</option>
                    <option value="write">Hybrid (Read/Write)</option>
                    <option value="autonomous">Full Auto (Autonomous)</option>
                  </select>
                </div>

                {/* Terms and Signature Checkbox */}
                <div className="input-field-group">
                  <label className="monochrome-card" htmlFor="accept-terms-mob">
                    <input 
                      type="checkbox" 
                      id="accept-terms-mob" 
                      name="termsAccepted" 
                      required 
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                    />
                    <span className="card-selector-indicator square"></span>
                    <span className="card-selector-label highlight">Compile and Synchronize Codebase Link</span>
                  </label>
                  {dirtyFields.termsAccepted && !formData.termsAccepted && (
                    <span className="error-tip-msg text-center">Pipeline compile signature is required.</span>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <footer className="form-card-footer">
                <button type="button" className="btn-minimal" onClick={exitOnboarding}>
                  Revert
                </button>
                <button type="submit" className="btn-minimal active-style highlight-btn">
                  Initialize Sync
                </button>
              </footer>
            </form>
          </div>
        </main>
      )}

      {/* 3. CENTERED WIZARD ONBOARDING CARD */}
      {isStarted && !isMobile && (
        <main className="form-card-container">
          {/* Header */}
          <header className="brand-header">
            <div className="logo-halo-wrapper" onClick={exitOnboarding} style={{ cursor: 'pointer' }} title="Return to Homepage">
              <img src="/logo.webp" alt="Mirage Core Logo" className="brand-logo" />
            </div>
            <h1 className="brand-title">MIRAGE</h1>
            <p className="brand-tagline">INTEGRATION CONSOLE</p>
          </header>

          {/* Steps */}
          <nav className="step-progress-track" role="tablist">
            <button 
              className={`step-progress-dot ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
              onClick={() => handleTabClick(1)}
              aria-label="Step 1: Identity"
            >
              <span className="dot-number">01</span>
              <span className="dot-label">Identity</span>
            </button>
            
            <button 
              className={`step-progress-dot ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
              onClick={() => handleTabClick(2)}
              disabled={currentStep < 2}
              aria-label="Step 2: Parameters"
            >
              <span className="dot-number">02</span>
              <span className="dot-label">Parameters</span>
            </button>
            
            <button 
              className={`step-progress-dot ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}
              onClick={() => handleTabClick(3)}
              disabled={currentStep < 3}
              aria-label="Step 3: Directives"
            >
              <span className="dot-number">03</span>
              <span className="dot-label">Directives</span>
            </button>
            
            <button 
              className={`step-progress-dot ${currentStep === 4 ? 'active' : ''}`}
              onClick={() => handleTabClick(4)}
              disabled={currentStep < 4}
              aria-label="Step 4: Integration"
            >
              <span className="dot-number">04</span>
              <span className="dot-label">Sync</span>
            </button>
          </nav>

          {/* Form Body */}
          <div className="form-viewport-body">
            <form onSubmit={handleSubmitForm} noValidate>
              
              {/* Step 1 panel */}
              <div className={`step-panel ${currentStep === 1 ? 'active' : ''}`} id="panel-step-1">
                <div className="panel-header">
                  <h2>Entity Identity</h2>
                  <p>Provide secure operator profile credentials.</p>
                </div>

                <div className="input-fields-stack">
                  <div className="input-field-group">
                    <label htmlFor="client-name" className="field-label">Representative Name</label>
                    <input 
                      type="text" 
                      id="client-name" 
                      name="clientName" 
                      required 
                      minLength={2} 
                      placeholder="Elena Rostova"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.clientName ? (isFieldInvalid('clientName', 'client-name') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    />
                    {isFieldInvalid('clientName', 'client-name') && (
                      <span className="error-tip-msg">Representative name must be at least 2 characters.</span>
                    )}
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="company-name" className="field-label">Company Faction</label>
                    <input 
                      type="text" 
                      id="company-name" 
                      name="companyName" 
                      required 
                      minLength={2} 
                      placeholder="Cyberdyne Laboratories"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.companyName ? (isFieldInvalid('companyName', 'company-name') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    />
                    {isFieldInvalid('companyName', 'company-name') && (
                      <span className="error-tip-msg">Company faction identification is required.</span>
                    )}
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="email" className="field-label">Communication Node (Email)</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      placeholder="operator@mirage.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.email ? (isFieldInvalid('email', 'email') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    />
                    {isFieldInvalid('email', 'email') && (
                      <span className="error-tip-msg">Please enter a valid communications link email.</span>
                    )}
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="website" className="field-label">Primary Node URL</label>
                    <input 
                      type="text" 
                      id="website" 
                      name="website" 
                      required 
                      placeholder="https://mirage.bureau"
                      value={formData.website}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.website ? (isFieldInvalid('website', 'website') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    />
                    {isFieldInvalid('website', 'website') && (
                      <span className="error-tip-msg">A valid absolute URL node is required.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 2 panel */}
              <div className={`step-panel ${currentStep === 2 ? 'active' : ''}`} id="panel-step-2">
                <div className="panel-header">
                  <h2>Parameters</h2>
                  <p>Configure operational timelines and budgets.</p>
                </div>

                <div className="input-fields-stack">
                  <div className="input-field-group">
                    <label htmlFor="project-type" className="field-label">Directive Objective</label>
                    <select 
                      id="project-type" 
                      name="projectType" 
                      required
                      value={formData.projectType}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.projectType ? (isFieldInvalid('projectType', 'project-type') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    >
                      <option value="" disabled>Select Directive</option>
                      <option value="autonomous-robots">Autonomous Robotics Pipeline</option>
                      <option value="neural-nexus">Neural Nexus Models</option>
                      <option value="cyber-interface">Advanced Web Terminals</option>
                      <option value="sensor-array">Hardware/IoT Networks</option>
                    </select>
                    {isFieldInvalid('projectType', 'project-type') && (
                      <span className="error-tip-msg">Directive objective target selection is required.</span>
                    )}
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="budget-tier" className="field-label">Credit Allocation</label>
                    <div className="premium-range-controller">
                      <div className="range-labels">
                        <span>$25k</span>
                        <span className="active-value">
                          {parseInt(formData.budget) >= 500000 ? '$500k+ (Max)' : `$${(parseInt(formData.budget)/1000).toFixed(0)}k`}
                        </span>
                        <span>$500k+</span>
                      </div>
                      <input 
                        type="range" 
                        id="budget-tier" 
                        name="budget" 
                        min="25000" 
                        max="500000" 
                        step="25000" 
                        value={formData.budget}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label htmlFor="timeline" className="field-label">Critical Launch Window</label>
                    <select 
                      id="timeline" 
                      name="timeline" 
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      onBlur={handleFieldBlur}
                      className={dirtyFields.timeline ? (isFieldInvalid('timeline', 'timeline') ? 'field-invalid-state' : 'field-valid-state') : ''}
                    >
                      <option value="" disabled>Select Window</option>
                      <option value="immediate">Immediate (&lt; 30 Days)</option>
                      <option value="q1">Alpha Core (60 - 90 Days)</option>
                      <option value="q2">Systematic Build (90 - 180 Days)</option>
                      <option value="backlog">Long-Range (180+ Days)</option>
                    </select>
                    {isFieldInvalid('timeline', 'timeline') && (
                      <span className="error-tip-msg">Launch window configuration selection is required.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3 panel */}
              <div className={`step-panel ${currentStep === 3 ? 'active' : ''}`} id="panel-step-3">
                <div className="panel-header">
                  <h2>Directives</h2>
                  <p>Authorize access controls and telemetry plugins.</p>
                </div>

                <div className="input-fields-stack">
                  <div className="input-field-group">
                    <label className="field-label">Mainframe Autonomy Level</label>
                    <div className="monochrome-radio-grid">
                      <label className="monochrome-card" htmlFor="level-read">
                        <input 
                          type="radio" 
                          id="level-read" 
                          name="autonomyLevel" 
                          value="read"
                          checked={formData.autonomyLevel === 'read'}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator"></span>
                        <span className="card-selector-label">Co-Pilot (Read-Only)</span>
                      </label>

                      <label className="monochrome-card" htmlFor="level-write">
                        <input 
                          type="radio" 
                          id="level-write" 
                          name="autonomyLevel" 
                          value="write"
                          checked={formData.autonomyLevel === 'write'}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator"></span>
                        <span className="card-selector-label">Hybrid (Read/Write)</span>
                      </label>

                      <label className="monochrome-card" htmlFor="level-autonomous">
                        <input 
                          type="radio" 
                          id="level-autonomous" 
                          name="autonomyLevel" 
                          value="autonomous"
                          checked={formData.autonomyLevel === 'autonomous'}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator"></span>
                        <span className="card-selector-label">Full Auto (Autonomous)</span>
                      </label>
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label className="field-label">Integration Plugins</label>
                    <div className="monochrome-checkbox-stack">
                      <label className="monochrome-card" htmlFor="plugin-security">
                        <input 
                          type="checkbox" 
                          id="plugin-security" 
                          name="plugins" 
                          value="sec-shield" 
                          checked={formData.plugins.includes('sec-shield')}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator square"></span>
                        <span className="card-selector-label">Quantum Security Shield</span>
                      </label>

                      <label className="monochrome-card" htmlFor="plugin-telemetry">
                        <input 
                          type="checkbox" 
                          id="plugin-telemetry" 
                          name="plugins" 
                          value="telemetry" 
                          checked={formData.plugins.includes('telemetry')}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator square"></span>
                        <span className="card-selector-label">Real-Time Telemetry Stream</span>
                      </label>

                      <label className="monochrome-card" htmlFor="plugin-db">
                        <input 
                          type="checkbox" 
                          id="plugin-db" 
                          name="plugins" 
                          value="db-nexus" 
                          checked={formData.plugins.includes('db-nexus')}
                          onChange={handleInputChange}
                        />
                        <span className="card-selector-indicator square"></span>
                        <span className="card-selector-label">Neural Vector Database</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 panel */}
              <div className={`step-panel ${currentStep === 4 ? 'active' : ''}`} id="panel-step-4">
                <div className="panel-header">
                  <h2>Synchronization</h2>
                  <p>Verify configurations before database deployment.</p>
                </div>

                <div className="minimalist-review-card">
                  <div className="review-grid-content">
                    <div className="review-item">
                      <span className="review-label">Operator Name</span>
                      <span className="review-value">{formData.clientName || 'Unregistered'}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Faction</span>
                      <span className="review-value">{formData.companyName || 'Unregistered'}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Communications link</span>
                      <span className="review-value">{formData.email || 'No Sync'}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Mainframe Autonomy</span>
                      <span className="review-value">{formData.autonomyLevel.toUpperCase()}</span>
                    </div>
                    <div className="review-item full-width">
                      <span className="review-label">Allocated Resources</span>
                      <span className="review-value">${parseInt(formData.budget).toLocaleString()} Credits</span>
                    </div>
                  </div>

                  <div className="review-signature-section">
                    <label className="monochrome-card" htmlFor="accept-terms">
                      <input 
                        type="checkbox" 
                        id="accept-terms" 
                        name="termsAccepted" 
                        required 
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                      />
                      <span className="card-selector-indicator square"></span>
                      <span className="card-selector-label highlight">Compile and Synchronize Codebase Link</span>
                    </label>
                    {dirtyFields.termsAccepted && !formData.termsAccepted && (
                      <span className="error-tip-msg text-center">Pipeline compile signature is required.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <footer className="form-card-footer">
                <button 
                  type="button" 
                  className="btn-minimal" 
                  onClick={prevStep}
                  style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
                >
                  Revert
                </button>

                {currentStep < 4 ? (
                  <button type="button" className="btn-minimal active-style" onClick={nextStep}>
                    Continue
                  </button>
                ) : (
                  <button type="submit" className="btn-minimal active-style highlight-btn">
                    Initialize Sync
                  </button>
                )}
              </footer>

            </form>
          </div>
        </main>
      )}


      {/* Success Modal */}
      {dialogOpen && (
        <div className="minimalist-success-popover">
          <div className="popover-shield" />
          <div className="popover-content-card">
            <header className="popover-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <img src="/logo.webp" alt="Mirage Symbol" style={{ width: '44px', height: '44px', marginBottom: '0.75rem' }} />
              <span className="popover-badge">SYNC SUCCESS</span>
              <h2 className="popover-title">Mainframe Compiled</h2>
            </header>
            
            <div className="popover-body">
              <p className="popover-desc">
                Operator configuration successfully synched with Mirage secure mainframe database.
              </p>
              
              <div className="popover-summary-box">
                <h3 className="summary-title">[DEPLOYMENT META]</h3>
                <div className="summary-rows">
                  <div className="summary-row"><span>OPERATOR:</span> <strong>{formData.clientName.toUpperCase()}</strong></div>
                  <div className="summary-row"><span>FACTION:</span> <strong>{formData.companyName.toUpperCase()}</strong></div>
                  <div className="summary-row"><span>AUTONOMY:</span> <strong>{formData.autonomyLevel.toUpperCase()}</strong></div>
                </div>
              </div>
            </div>

            <footer className="popover-footer">
              <button type="button" className="btn-minimal active-style" onClick={closeDialog}>
                Disconnect Link
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
