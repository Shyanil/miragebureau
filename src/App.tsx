import { useState, useEffect } from 'react';

const STORAGE_KEY = 'securify_mirage_onboarding_v5';

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
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [currentStep, setCurrentStep] = useState(1);
  const [dirtyFields, setDirtyFields] = useState<Record<string, boolean>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Dynamically manage body classes for Securify stark dark styling
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    htmlEl.classList.add('securify-active');
    bodyEl.classList.add('securify-active');

    return () => {
      htmlEl.classList.remove('securify-active');
      bodyEl.classList.remove('securify-active');
    };
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
            plugins: Array.isArray(state.formData.plugins) ? state.formData.plugins : INITIAL_STATE.plugins
          });
        }
        setCurrentStep(state.currentStep || 1);
      } catch (e) {
        console.warn("Storage restore error:", e);
      }
    }
  }, []);

  const handleFormChange = (fields: Partial<typeof INITIAL_STATE>) => {
    const updated = { ...formData, ...fields };
    setFormData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData: updated, currentStep }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name === 'termsAccepted') {
        handleFormChange({ termsAccepted: checkbox.checked });
      } else {
        const currentPlugins = [...formData.plugins];
        if (checkbox.checked) {
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

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setDirtyFields(prev => ({ ...prev, [name]: true }));
  };

  const nextStep = () => {
    const panel = document.getElementById(`panel-step-${currentStep}`);
    const inputs = panel ? panel.querySelectorAll('input, select') : [];
    let allValid = true;
    const newDirty = { ...dirtyFields };

    inputs.forEach(input => {
      const el = input as HTMLInputElement | HTMLSelectElement;
      newDirty[el.name] = true;
      if (!el.checkValidity()) {
        allValid = false;
        el.classList.add('border-red-500');
      } else {
        el.classList.remove('border-red-500');
      }
    });

    setDirtyFields(newDirty);

    if (allValid) {
      const next = currentStep + 1;
      setCurrentStep(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: next }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: prev }));
    }
  };

  const handleTabClick = (stepTarget: number) => {
    if (stepTarget < currentStep) {
      setCurrentStep(stepTarget);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, currentStep: stepTarget }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formEl = e.currentTarget as HTMLFormElement;
    const inputs = formEl ? formEl.querySelectorAll('input, select') : [];
    let allValid = true;
    const newDirty = { ...dirtyFields };

    inputs.forEach(input => {
      const el = input as HTMLInputElement | HTMLSelectElement;
      newDirty[el.name] = true;
      if (!el.checkValidity()) {
        allValid = false;
        el.classList.add('border-red-500');
      } else {
        el.classList.remove('border-red-500');
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
    setFormData(INITIAL_STATE);
    setDirtyFields({});
    setCurrentStep(1);
  };

  const isFieldInvalid = (name: string, id: string) => {
    if (!dirtyFields[name]) return false;
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    return el ? !el.checkValidity() : false;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* Navbar / Header - Minimalist Brand Element Only */}
      <header className="absolute z-20 px-6 md:px-10 pt-6 top-0 left-0 right-0">
        <nav className="flex items-center justify-between gap-4">
          {/* Left brand pill: Dolby VP Logo + Dot (No Text) */}
          <div className="flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur rounded-full px-4 py-3 animate-fade-in">
            <svg
              viewBox="0 0 256 256"
              className="h-5 w-5 fill-white"
            >
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-sm font-extrabold leading-none">.</span>
          </div>
        </nav>
      </header>

      {/* Foreground Content Wrapper - Only the Centered Form Card */}
      <div className="relative h-full w-full z-10 pointer-events-none flex items-center justify-center">
        
        {/* Embedded 4-stage Mirage Integration Wizard (Centered) */}
        <div className="w-[calc(100%-3rem)] max-w-[450px] bg-neutral-950/85 border border-neutral-800 backdrop-blur-md rounded-2xl p-6 text-white flex flex-col pointer-events-auto shadow-2xl z-30 animate-fade-in">
          
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-sm font-medium tracking-wider text-white uppercase">mirage integration console</h2>
            <p className="text-xs text-neutral-400 mt-0.5 lowercase font-mono">secure operator profile credentials</p>
          </div>

          {/* Stepper progress track */}
          <div className="grid grid-cols-4 gap-2 mb-6" role="tablist">
            {[
              { num: '01', label: 'Identity' },
              { num: '02', label: 'Params' },
              { num: '03', label: 'Directives' },
              { num: '04', label: 'Sync' }
            ].map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              
              return (
                <button
                  key={step.num}
                  type="button"
                  className="flex flex-col text-left group border-none bg-transparent cursor-pointer"
                  onClick={() => handleTabClick(stepNum)}
                  disabled={currentStep < stepNum}
                >
                  <span className={`text-[10px] font-mono leading-none ${isActive ? 'text-white font-bold' : isCompleted ? 'text-white/60' : 'text-neutral-600'}`}>
                    {step.num}
                  </span>
                  <span className={`text-[11px] font-sans truncate ${isActive ? 'text-white font-medium' : isCompleted ? 'text-white/70' : 'text-neutral-500'}`}>
                    {step.label}
                  </span>
                  <div className={`h-[2px] w-full mt-1.5 transition-all duration-300 ${isActive ? 'bg-white' : isCompleted ? 'bg-white/40' : 'bg-neutral-800'}`} />
                </button>
              );
            })}
          </div>

          {/* Wizard Form */}
          <form onSubmit={handleSubmitForm} noValidate className="flex flex-col flex-1">
            
            {/* Step 1: Entity Identity */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-4" id="panel-step-1">
                <div className="flex flex-col gap-1">
                  <label htmlFor="client-name" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Representative Name</label>
                  <input 
                    type="text" 
                    id="client-name" 
                    name="clientName" 
                    required 
                    minLength={2} 
                    placeholder="elena rostova"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={`bg-transparent border-b py-2 text-sm text-white focus:outline-none transition-all placeholder-neutral-700 ${dirtyFields.clientName ? (isFieldInvalid('clientName', 'client-name') ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-white') : 'border-neutral-800 focus:border-white'}`}
                  />
                  {isFieldInvalid('clientName', 'client-name') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">Representative name must be at least 2 characters.</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="company-name" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Company Faction</label>
                  <input 
                    type="text" 
                    id="company-name" 
                    name="companyName" 
                    required 
                    minLength={2} 
                    placeholder="cyberdyne laboratories"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={`bg-transparent border-b py-2 text-sm text-white focus:outline-none transition-all placeholder-neutral-700 ${dirtyFields.companyName ? (isFieldInvalid('companyName', 'company-name') ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-white') : 'border-neutral-800 focus:border-white'}`}
                  />
                  {isFieldInvalid('companyName', 'company-name') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">Company faction identification is required.</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Communication Node (Email)</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="operator@mirage.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={`bg-transparent border-b py-2 text-sm text-white focus:outline-none transition-all placeholder-neutral-700 ${dirtyFields.email ? (isFieldInvalid('email', 'email') ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-white') : 'border-neutral-800 focus:border-white'}`}
                  />
                  {isFieldInvalid('email', 'email') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">Please enter a valid communications link email.</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="website" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Primary Node URL</label>
                  <input 
                    type="text" 
                    id="website" 
                    name="website" 
                    required 
                    placeholder="https://mirage.bureau"
                    value={formData.website}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className={`bg-transparent border-b py-2 text-sm text-white focus:outline-none transition-all placeholder-neutral-700 ${dirtyFields.website ? (isFieldInvalid('website', 'website') ? 'border-red-500 focus:border-red-500' : 'border-white focus:border-white') : 'border-neutral-800 focus:border-white'}`}
                  />
                  {isFieldInvalid('website', 'website') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">A valid absolute URL node is required.</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Parameters */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-4" id="panel-step-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="project-type" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Directive Objective</label>
                  <select 
                    id="project-type" 
                    name="projectType" 
                    required
                    value={formData.projectType}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-white transition-all outline-none"
                  >
                    <option value="" disabled>Select Directive</option>
                    <option value="autonomous-robots">Autonomous Robotics Pipeline</option>
                    <option value="neural-nexus">Neural Nexus Models</option>
                    <option value="cyber-interface">Advanced Web Terminals</option>
                    <option value="sensor-array">Hardware/IoT Networks</option>
                  </select>
                  {isFieldInvalid('projectType', 'project-type') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">Directive objective target selection is required.</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="budget-tier" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Credit Allocation</label>
                  <div className="flex flex-col gap-1 mt-1 bg-neutral-900/40 border border-neutral-900 rounded-xl p-3">
                    <div className="flex justify-between items-center text-xs font-mono mb-1 text-white">
                      <span>$25k</span>
                      <span className="text-white font-bold bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {parseInt(formData.budget) >= 500000 ? '$500k+' : `$${(parseInt(formData.budget)/1000).toFixed(0)}k`}
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
                      className="accent-white h-1 w-full bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="timeline" className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Critical Launch Window</label>
                  <select 
                    id="timeline" 
                    name="timeline" 
                    required
                    value={formData.timeline}
                    onChange={handleInputChange}
                    onBlur={handleFieldBlur}
                    className="bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-sm text-white focus:border-white transition-all outline-none"
                  >
                    <option value="" disabled>Select Window</option>
                    <option value="immediate">Immediate (&lt; 30 Days)</option>
                    <option value="q1">Alpha Core (60 - 90 Days)</option>
                    <option value="q2">Systematic Build (90 - 180 Days)</option>
                    <option value="backlog">Long-Range (180+ Days)</option>
                  </select>
                  {isFieldInvalid('timeline', 'timeline') && (
                    <span className="text-[10px] text-red-400 mt-1 lowercase font-mono">Launch window configuration selection is required.</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Directives */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4 text-white" id="panel-step-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Mainframe Autonomy Level</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 'read', label: 'Co-Pilot (Read-Only)' },
                      { val: 'write', label: 'Hybrid (Read/Write)' },
                      { val: 'autonomous', label: 'Full Auto (Autonomous)' }
                    ].map(opt => (
                      <label 
                        key={opt.val}
                        className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${formData.autonomyLevel === opt.val ? 'border-white bg-neutral-900' : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'}`}
                      >
                        <input 
                          type="radio" 
                          name="autonomyLevel" 
                          value={opt.val}
                          checked={formData.autonomyLevel === opt.val}
                          onChange={handleInputChange}
                          className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                        />
                        <span className="text-xs uppercase font-mono tracking-wider">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-neutral-300 uppercase tracking-wider font-mono">Integration Plugins</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 'sec-shield', label: 'Quantum Security Shield' },
                      { val: 'telemetry', label: 'Real-Time Telemetry Stream' },
                      { val: 'db-nexus', label: 'Neural Vector Database' }
                    ].map(opt => (
                      <label 
                        key={opt.val}
                        className={`flex items-center gap-3 border p-3 rounded-xl cursor-pointer transition-all ${formData.plugins.includes(opt.val) ? 'border-white bg-neutral-900' : 'border-neutral-800/80 bg-neutral-900/30 hover:border-neutral-700'}`}
                      >
                        <input 
                          type="checkbox" 
                          name="plugins" 
                          value={opt.val}
                          checked={formData.plugins.includes(opt.val)}
                          onChange={handleInputChange}
                          className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700"
                        />
                        <span className="text-xs uppercase font-mono tracking-wider">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Sync */}
            {currentStep === 4 && (
              <div className="flex flex-col gap-4 text-white animate-fade-in" id="panel-step-4">
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2.5">
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-xs text-neutral-400 font-mono">Operator</span>
                    <span className="text-xs text-white font-medium lowercase font-mono">{formData.clientName || 'unregistered'}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-xs text-neutral-400 font-mono">Faction</span>
                    <span className="text-xs text-white font-medium lowercase font-mono">{formData.companyName || 'unregistered'}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-xs text-neutral-400 font-mono">Comms Link</span>
                    <span className="text-xs text-white font-medium lowercase font-mono truncate max-w-[200px]">{formData.email || 'no sync'}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                    <span className="text-xs text-neutral-400 font-mono">Autonomy</span>
                    <span className="text-xs text-white font-medium uppercase font-mono">{formData.autonomyLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400 font-mono">Allocation</span>
                    <span className="text-xs text-white font-medium font-mono">${parseInt(formData.budget).toLocaleString()} credits</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-1">
                  <label className="flex items-start gap-3 cursor-pointer group p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-xl hover:border-neutral-700 transition-colors">
                    <input 
                      type="checkbox" 
                      name="termsAccepted" 
                      required 
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                      className="accent-white cursor-pointer h-4 w-4 bg-black border-neutral-700 mt-0.5"
                    />
                    <span className="text-xs text-neutral-300 group-hover:text-white transition-colors leading-relaxed lowercase font-mono">
                      compile and synchronize codebase link
                    </span>
                  </label>
                  {dirtyFields.termsAccepted && !formData.termsAccepted && (
                    <span className="text-[10px] text-red-400 lowercase font-mono text-center">Pipeline compile signature is required.</span>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Form Footer */}
            <div className="flex justify-between items-center gap-4 mt-6 pt-4 border-t border-neutral-900">
              <button 
                type="button" 
                className="bg-transparent text-neutral-400 hover:text-white py-2.5 px-4 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-neutral-800"
                onClick={prevStep}
                style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
              >
                revert
              </button>

              {currentStep < 4 ? (
                <button 
                  type="button" 
                  className="bg-white text-black hover:bg-neutral-200 py-2.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  onClick={nextStep}
                >
                  continue
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="bg-white text-black hover:bg-neutral-200 py-2.5 px-6 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  initialize sync
                </button>
              )}
            </div>

          </form>

        </div>

      </div>

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black z-10" />

      {/* Live Sync Success Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeDialog} />
          
          <div className="relative bg-neutral-950 border border-neutral-800 rounded-2xl p-6 max-w-sm w-full text-white text-center shadow-2xl animate-fade-in font-sans">
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 256 256" className="h-10 w-10 fill-white">
                <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
              </svg>
            </div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">sync status</h3>
            <h4 className="text-lg font-medium mt-1 mb-2 lowercase text-white">mainframe compiled</h4>
            <p className="text-sm text-neutral-400 mb-6 lowercase leading-relaxed">
              operator configuration successfully synced with securify secure mainframe database.
            </p>
            
            <button
              onClick={closeDialog}
              className="w-full bg-white text-black py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              disconnect link
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
