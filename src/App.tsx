import { useState, useRef } from 'react';

type FormStep = 1 | 2 | 3;

interface FormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  vision: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  company: '',
  email: '',
  projectType: '',
  budget: '',
  timeline: '',
  vision: '',
};

export default function App() {
  const [step, setStep] = useState<FormStep>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black select-none">

      {/* ── Background Video ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* ── Gradient overlays ── */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/60 z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[1]" />

      {/* ── Header ── */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 md:px-12 pt-7 flex items-center">
        <img
          src="/logo.webp"
          alt="Higgsfield"
          className="h-7 md:h-8 w-auto object-contain"
        />
      </header>

      {/* ── Main layout: left copy + right form ── */}
      <div className="relative z-10 h-full flex items-center px-8 md:px-12 pt-20 pb-10 gap-8 md:gap-16">

        {/* Left — editorial copy */}
        <div className="hidden md:flex flex-col justify-center flex-1 gap-6 pr-4">
          <p className="text-white/50 text-sm tracking-[0.25em] uppercase font-light">
            Creative Agency
          </p>

          <h1
            className="text-white font-light leading-[0.92] tracking-[-0.04em]"
            style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', fontStyle: 'italic' }}
          >
            We craft<br />
            <em className="not-italic font-extralight text-white/60">worlds that</em><br />
            move people.
          </h1>

          <p
            className="text-white/50 font-light leading-relaxed max-w-xs"
            style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)', fontStyle: 'italic' }}
          >
            AI-native filmmaking, brand stories, and generative visuals —
            built for founders who refuse to look ordinary.
          </p>
        </div>

        {/* Right — onboarding form */}
        <div
          ref={formRef}
          className="w-full md:w-[400px] lg:w-[440px] flex-shrink-0 ml-auto"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8, 8, 8, 0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="p-7 md:p-8 flex flex-col gap-5">

                {/* Form header */}
                <div className="mb-1">
                  <h2 className="text-white font-light text-xl tracking-tight" style={{ fontStyle: 'italic' }}>
                    Start a project
                  </h2>
                  <p className="text-white/40 text-xs mt-1 font-light tracking-wide">
                    {step === 1 && 'Who are you?'}
                    {step === 2 && 'Tell us about the work.'}
                    {step === 3 && 'Your vision.'}
                  </p>
                </div>

                {/* Step 1 — Identity */}
                {step === 1 && (
                  <>
                    <Field
                      label="Your name"
                      placeholder="Alex Rivera"
                      value={form.name}
                      onChange={v => update('name', v)}
                      required
                    />
                    <Field
                      label="Company"
                      placeholder="Acme Corp"
                      value={form.company}
                      onChange={v => update('company', v)}
                    />
                    <Field
                      label="Email"
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={v => update('email', v)}
                      required
                    />
                    <NavButtons
                      onNext={() => setStep(2)}
                      showBack={false}
                      nextLabel="Continue →"
                    />
                  </>
                )}

                {/* Step 2 — Project */}
                {step === 2 && (
                  <>
                    <SelectField
                      label="Type of project"
                      value={form.projectType}
                      onChange={v => update('projectType', v)}
                      options={[
                        { value: '', label: 'Select one…' },
                        { value: 'brand-film', label: 'Brand film' },
                        { value: 'campaign', label: 'Campaign visuals' },
                        { value: 'product', label: 'Product showcase' },
                        { value: 'social', label: 'Social content' },
                        { value: 'other', label: 'Something else' },
                      ]}
                      required
                    />
                    <SelectField
                      label="Budget range"
                      value={form.budget}
                      onChange={v => update('budget', v)}
                      options={[
                        { value: '', label: 'Select one…' },
                        { value: 'under-10k', label: 'Under $10k' },
                        { value: '10k-50k', label: '$10k – $50k' },
                        { value: '50k-150k', label: '$50k – $150k' },
                        { value: '150k-plus', label: '$150k+' },
                      ]}
                    />
                    <SelectField
                      label="Timeline"
                      value={form.timeline}
                      onChange={v => update('timeline', v)}
                      options={[
                        { value: '', label: 'Select one…' },
                        { value: 'asap', label: 'ASAP' },
                        { value: '1mo', label: 'Within a month' },
                        { value: '3mo', label: 'This quarter' },
                        { value: 'flexible', label: 'Flexible' },
                      ]}
                    />
                    <NavButtons
                      onBack={() => setStep(1)}
                      onNext={() => setStep(3)}
                      nextLabel="Continue →"
                    />
                  </>
                )}

                {/* Step 3 — Vision */}
                {step === 3 && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-light tracking-widest uppercase">
                        Describe your vision
                      </label>
                      <textarea
                        rows={5}
                        placeholder="We want something cinematic, unexpected — something that makes people stop scrolling…"
                        value={form.vision}
                        onChange={e => update('vision', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-light placeholder-white/25 focus:outline-none focus:border-white/30 resize-none transition-colors"
                        style={{ fontStyle: 'italic' }}
                        required
                      />
                    </div>
                    <NavButtons
                      onBack={() => setStep(2)}
                      isSubmit
                      nextLabel="Send brief"
                    />
                  </>
                )}

                {/* Step indicator */}
                <div className="flex items-center gap-2 justify-center pt-1">
                  {([1, 2, 3] as FormStep[]).map(s => (
                    <div
                      key={s}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: s === step ? '20px' : '6px',
                        height: '4px',
                        background: s === step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>
              </form>
            ) : (
              /* Success state */
              <div className="p-8 flex flex-col items-start gap-4 min-h-[320px] justify-center">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-white font-light text-xl tracking-tight" style={{ fontStyle: 'italic' }}>
                  Brief received.
                </h3>
                <p className="text-white/40 text-sm font-light leading-relaxed">
                  We'll reach out to <span className="text-white/70">{form.email}</span> within one business day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Shared sub-components ── */

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-light tracking-widest uppercase">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-light placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
        style={{ fontStyle: 'italic' }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/60 text-xs font-light tracking-widest uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-light focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
        style={{ fontStyle: 'italic', background: 'rgba(255,255,255,0.05)' }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#111', color: '#fff' }}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  isSubmit,
  nextLabel,
  showBack = true,
}: {
  onBack?: () => void;
  onNext?: () => void;
  isSubmit?: boolean;
  nextLabel?: string;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 pt-1">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex-shrink-0 px-5 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-light hover:border-white/25 hover:text-white/80 transition-colors cursor-pointer"
        >
          ←
        </button>
      )}
      {isSubmit ? (
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-light tracking-wide hover:bg-white/90 transition-colors cursor-pointer"
          style={{ fontStyle: 'italic' }}
        >
          {nextLabel ?? 'Submit'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-2.5 rounded-xl bg-white text-black text-sm font-light tracking-wide hover:bg-white/90 transition-colors cursor-pointer"
          style={{ fontStyle: 'italic' }}
        >
          {nextLabel ?? 'Next'}
        </button>
      )}
    </div>
  );
}
