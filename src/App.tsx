import { useState, useEffect } from 'react';

type Step = 1 | 2 | 3;

interface FormData {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  vision: string;
}

const EMPTY: FormData = {
  name: '', company: '', email: '',
  projectType: '', budget: '', timeline: '', vision: '',
};

export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  /* Force body to be solid black + no scroll */
  useEffect(() => {
    const prev = {
      bg: document.body.style.background,
      overflow: document.body.style.overflow,
      margin: document.body.style.margin,
      height: document.documentElement.style.height,
    };
    document.body.style.background = '#000';
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100%';
      root.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.background = prev.bg;
      document.body.style.overflow = prev.overflow;
      document.body.style.margin = prev.margin;
    };
  }, []);

  const set = (k: keyof FormData, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', fontFamily: "'Outfit', sans-serif" }}>

      {/* ══ FULLSCREEN VIDEO ══ */}
      <video
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        autoPlay loop muted playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* ══ GRADIENT LAYERS ══ */}
      {/* Left darkening for text readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.2) 100%)',
      }} />
      {/* Right darkening for form readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to left, rgba(0,0,0,0.72) 0%, transparent 60%)',
      }} />
      {/* Bottom vignette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
      }} />

      {/* ══ HEADER ══ */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img src="/logo.webp" alt="Higgsfield" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
        <span style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)', fontWeight: 300,
        }}>
          AI Creative Agency
        </span>
      </header>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        padding: '100px 48px 60px',
        gap: 48,
      }}>

        {/* ── LEFT: Editorial copy ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 100,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)',
            width: 'fit-content',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', opacity: 0.6 }} />
            <span style={{ fontSize: 10.5, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.5)', fontWeight: 300, textTransform: 'uppercase' }}>
              Higgsfield Bureau
            </span>
          </div>

          <h1 style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(52px, 6.5vw, 92px)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 0.94,
            letterSpacing: '-0.03em',
            color: '#fff',
          }}>
            We craft<br />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>worlds that</span><br />
            move people.
          </h1>

          <p style={{
            margin: 0, maxWidth: 320,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(15px, 1.4vw, 18px)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.65,
          }}>
            AI-native filmmaking, brand stories &amp; generative
            visuals — for founders who refuse to look ordinary.
          </p>

          {/* Decorative line */}
          <div style={{
            width: 48, height: 1,
            background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
          }} />
        </div>

        {/* ── RIGHT: Onboarding form ── */}
        <div style={{ width: 400, flexShrink: 0 }}>
          <div style={{
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(12,12,14,0.78)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>

            {/* Card header bar */}
            <div style={{
              padding: '22px 28px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 300, marginBottom: 6 }}>
                  Client Brief
                </p>
                <h2 style={{
                  margin: 0, color: '#fff', fontWeight: 300,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic', fontSize: 22, letterSpacing: '-0.01em',
                }}>
                  {step === 1 && 'Who are you?'}
                  {step === 2 && 'The project.'}
                  {step === 3 && 'Your vision.'}
                </h2>
              </div>
              {/* Step bubbles */}
              <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 4 }}>
                {([1, 2, 3] as Step[]).map(s => (
                  <div key={s} style={{
                    borderRadius: 100,
                    transition: 'all 0.3s ease',
                    width: s === step ? 20 : 6,
                    height: 4,
                    background: s === step ? 'rgba(255,255,255,0.9)' : s < step ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                  }} />
                ))}
              </div>
            </div>

            {/* Form body */}
            {!submitted ? (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
                style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

                {step === 1 && (<>
                  <Field label="Full name" placeholder="Alex Rivera" value={form.name} onChange={v => set('name', v)} required />
                  <Field label="Company" placeholder="Acme Studios" value={form.company} onChange={v => set('company', v)} />
                  <Field label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={v => set('email', v)} required />
                  <Btn onClick={() => setStep(2)} label="Continue" />
                </>)}

                {step === 2 && (<>
                  <Select label="Type of project" value={form.projectType} onChange={v => set('projectType', v)} required
                    options={['Brand film', 'Campaign visuals', 'Product showcase', 'Social content', 'Other']} />
                  <Select label="Budget" value={form.budget} onChange={v => set('budget', v)}
                    options={['Under $10k', '$10k – $50k', '$50k – $150k', '$150k+']} />
                  <Select label="Timeline" value={form.timeline} onChange={v => set('timeline', v)}
                    options={['ASAP', 'Within a month', 'This quarter', 'Flexible']} />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <BackBtn onClick={() => setStep(1)} />
                    <Btn onClick={() => setStep(3)} label="Continue" />
                  </div>
                </>)}

                {step === 3 && (<>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label style={labelStyle}>Describe your vision</label>
                    <textarea
                      rows={5} required
                      placeholder="We want something cinematic, unexpected — something that stops people mid-scroll…"
                      value={form.vision}
                      onChange={e => set('vision', e.target.value)}
                      style={{ ...inputStyle, resize: 'none', fontStyle: 'italic', lineHeight: 1.6 }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <BackBtn onClick={() => setStep(2)} />
                    <SubmitBtn label="Send brief" />
                  </div>
                </>)}
              </form>
            ) : (
              <div style={{ padding: '40px 28px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 280, justifyContent: 'center' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M1.5 6L5.5 10L14.5 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{
                  margin: 0, color: '#fff', fontWeight: 300,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: 'italic', fontSize: 24,
                }}>Brief received.</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 300, lineHeight: 1.6 }}>
                  We'll reach out to <span style={{ color: 'rgba(255,255,255,0.75)' }}>{form.email}</span> within one business day.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared style tokens ── */

const labelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.38)', fontWeight: 300,
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 12,
  padding: '11px 14px',
  color: '#fff',
  fontSize: 13,
  fontWeight: 300,
  fontFamily: "'Outfit', sans-serif",
  outline: 'none',
  transition: 'border-color 0.2s',
};

/* ── Field components ── */

function Field({ label, placeholder, value, onChange, type = 'text', required }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputStyle, borderColor: focused ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)' }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value} required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          cursor: 'pointer', appearance: 'none',
          borderColor: focused ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)',
        }}
      >
        <option value="" style={{ background: '#111' }}>Select…</option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: '#111', color: '#fff' }}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Btn({ onClick, label }: { onClick?: () => void; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button type={onClick ? 'button' : 'submit'} onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none',
        background: hov ? 'rgba(255,255,255,0.95)' : '#fff',
        color: '#000', fontSize: 13, fontWeight: 400,
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer', transition: 'all 0.2s',
        letterSpacing: '0.02em',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 8px 24px rgba(255,255,255,0.15)' : 'none',
      }}>
      {label} →
    </button>
  );
}

function SubmitBtn({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="submit"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none',
        background: hov ? 'rgba(255,255,255,0.95)' : '#fff',
        color: '#000', fontSize: 13, fontWeight: 400,
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer', transition: 'all 0.2s',
        letterSpacing: '0.02em',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? '0 8px 24px rgba(255,255,255,0.15)' : 'none',
      }}>
      {label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 44, padding: '12px', borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.1)',
        background: hov ? 'rgba(255,255,255,0.07)' : 'transparent',
        color: 'rgba(255,255,255,0.5)', fontSize: 14,
        cursor: 'pointer', transition: 'all 0.2s',
        flexShrink: 0,
      }}>
      ←
    </button>
  );
}
