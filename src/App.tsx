import { useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Responsive hook
───────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type Step = 1 | 2 | 3;
interface FormData {
  name: string; company: string; email: string;
  projectType: string; budget: string; timeline: string; vision: string;
}
const EMPTY: FormData = {
  name: '', company: '', email: '',
  projectType: '', budget: '', timeline: '', vision: '',
};

/* ─────────────────────────────────────────────
   Root App
───────────────────────────────────────────── */
export default function App() {
  const isMobile = useIsMobile();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  /* Freeze body */
  useEffect(() => {
    document.body.style.cssText = 'margin:0;padding:0;background:#000;overflow:hidden;height:100%';
    document.documentElement.style.cssText = 'height:100%;overflow:hidden';
    const root = document.getElementById('root');
    if (root) root.style.cssText = 'height:100%;overflow:hidden';
    return () => {
      document.body.style.cssText = '';
      document.documentElement.style.cssText = '';
    };
  }, []);

  const set = (k: keyof FormData, v: string) =>
    setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#000',
      fontFamily: "'Outfit', ui-sans-serif, sans-serif",
    }}>
      {/* ══ VIDEO ══ */}
      <video
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }}
        autoPlay loop muted playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* ══ OVERLAYS ══ */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.65) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }} />

      {isMobile
        ? <MobileLayout step={step} setStep={setStep} form={form} set={set} submitted={submitted} setSubmitted={setSubmitted} />
        : <DesktopLayout step={step} setStep={setStep} form={form} set={set} submitted={submitted} setSubmitted={setSubmitted} />
      }
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared layout props
───────────────────────────────────────────── */
interface LayoutProps {
  step: Step; setStep: (s: Step) => void;
  form: FormData; set: (k: keyof FormData, v: string) => void;
  submitted: boolean; setSubmitted: (v: boolean) => void;
}

/* ─────────────────────────────────────────────
   Desktop Layout  (centered logo + right form)
───────────────────────────────────────────── */
function DesktopLayout({ step, setStep, form, set, submitted, setSubmitted }: LayoutProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>

      {/* Minimal header — label only, no duplicate logo */}
      <header style={{
        padding: '32px 52px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0,
      }}>
        <span style={{ fontSize: 10.5, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', fontWeight: 300 }}>
          Creative Agency
        </span>
      </header>

      {/* Body row */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '24px 52px 52px', gap: 48, minHeight: 0 }}>

        {/* LEFT — centered logo + editorial copy */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          gap: 28, minWidth: 0, textAlign: 'left',
        }}>

          {/* Elegant minimalist prefix tag */}
          <div style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <span>Creative Studio</span>
            <div style={{ width: 24, height: 1, background: 'rgba(255,255,255,0.3)' }} />
          </div>

          <h1 style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(38px, 5vw, 72px)',
            fontWeight: 300, fontStyle: 'italic',
            lineHeight: 0.96, letterSpacing: '-0.03em', color: '#fff',
          }}>
            We craft<br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>worlds that</span><br />
            move people.
          </h1>

          <p style={{
            margin: 0, maxWidth: 280,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(13px, 1.2vw, 16px)',
            fontStyle: 'italic', fontWeight: 300,
            color: 'rgba(255,255,255,0.38)', lineHeight: 1.75,
          }}>
            AI-native filmmaking, brand stories &amp; generative
            visuals — for founders who refuse to look ordinary.
          </p>
        </div>

        {/* RIGHT — form */}
        <div style={{ width: 400, flexShrink: 0 }}>
          <FormCard step={step} setStep={setStep} form={form} set={set} submitted={submitted} setSubmitted={setSubmitted} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile Layout  (stacked, scrollable)
───────────────────────────────────────────── */
function MobileLayout({ step, setStep, form, set, submitted, setSubmitted }: LayoutProps) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      overflowY: 'auto', overflowX: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* Mobile header */}
      <header style={{ padding: '28px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src="/logo.webp" alt="Mirage Bureau" style={{ height: 26, objectFit: 'contain' }} />
      </header>

      {/* Hero text block */}
      <div style={{ padding: '40px 24px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>

        {/* Logo large — mobile hero graphic */}
        <img
          src="/logo.webp"
          alt="Mirage Bureau"
          style={{
            width: 180,
            objectFit: 'contain',
            opacity: 0.95,
            filter: 'drop-shadow(0 0 32px rgba(255,255,255,0.1))',
            marginBottom: 8,
          }}
        />

        <h1 style={{
          margin: 0,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(36px, 10vw, 56px)',
          fontWeight: 300, fontStyle: 'italic',
          lineHeight: 0.97, letterSpacing: '-0.025em', color: '#fff',
        }}>
          We craft<br />
          <span style={{ color: 'rgba(255,255,255,0.42)' }}>worlds that</span><br />
          move people.
        </h1>

        <p style={{
          margin: 0, maxWidth: 280,
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15, fontStyle: 'italic', fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.65,
        }}>
          AI-native filmmaking &amp; generative visuals — for founders who refuse to look ordinary.
        </p>
      </div>

      {/* Form card — full width, bottom of screen */}
      <div style={{ padding: '0 16px 40px', marginTop: 'auto' }}>
        <FormCard step={step} setStep={setStep} form={form} set={set} submitted={submitted} setSubmitted={setSubmitted} mobile />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared Form Card
───────────────────────────────────────────── */
function FormCard({ step, setStep, form, set, submitted, setSubmitted, mobile }: LayoutProps & { mobile?: boolean }) {
  return (
    <div style={{
      borderRadius: mobile ? 20 : 22,
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(10,10,12,0.82)',
      backdropFilter: 'blur(40px)',
      WebkitBackdropFilter: 'blur(40px)',
      overflow: 'hidden',
      boxShadow: '0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
    }}>

      {/* Card top bar */}
      <div style={{
        padding: mobile ? '18px 22px 14px' : '20px 28px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          {/* Logo in form */}
          <img
            src="/logo.webp"
            alt="Mirage Bureau"
            style={{
              height: mobile ? 20 : 25,
              objectFit: 'contain',
              display: 'block',
              marginBottom: 10,
              opacity: 0.95,
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.3))',
            }}
          />
          <h2 style={{
            margin: 0, color: '#fff', fontWeight: 300,
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontSize: mobile ? 19 : 21, letterSpacing: '-0.01em',
          }}>
            {step === 1 && 'Who are you?'}
            {step === 2 && 'The project.'}
            {step === 3 && 'Your vision.'}
          </h2>
        </div>

        {/* Step pill indicators */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', paddingTop: 2 }}>
          {([1, 2, 3] as Step[]).map(s => (
            <div key={s} style={{
              borderRadius: 100, transition: 'all 0.3s ease',
              width: s === step ? 18 : 5, height: 4,
              background: s === step
                ? 'rgba(255,255,255,0.9)'
                : s < step ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.12)',
            }} />
          ))}
        </div>
      </div>

      {/* Form body */}
      {!submitted ? (
        <form
          onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
          style={{ padding: mobile ? '20px 22px 24px' : '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 16 }}
        >
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              <label style={labelStyle}>Describe your vision</label>
              <textarea
                rows={4} required
                placeholder="Something cinematic, unexpected — something that stops people mid-scroll…"
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
        <div style={{ padding: mobile ? '32px 22px' : '36px 28px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 200, justifyContent: 'center' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M1 5.5L4.5 9L14 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 style={{
            margin: 0, color: '#fff', fontWeight: 300,
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic', fontSize: 22,
          }}>Brief received.</h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.38)', fontSize: 13, fontWeight: 300, lineHeight: 1.65 }}>
            We'll reach out to <span style={{ color: 'rgba(255,255,255,0.72)' }}>{form.email}</span> within one business day.
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Style tokens
───────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.36)', fontWeight: 300,
};
const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 11, padding: '10px 13px',
  color: '#fff', fontSize: 13, fontWeight: 300,
  fontFamily: "'Outfit', sans-serif",
  outline: 'none', transition: 'border-color 0.2s',
};

/* ─────────────────────────────────────────────
   Shared micro-components
───────────────────────────────────────────── */
function Field({ label, placeholder, value, onChange, type = 'text', required }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value} required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ ...inputStyle, borderColor: f ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)' }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={labelStyle}>{label}</label>
      <select
        value={value} required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ ...inputStyle, cursor: 'pointer', appearance: 'none', borderColor: f ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.09)' }}
      >
        <option value="" style={{ background: '#0d0d0d' }}>Select…</option>
        {options.map(o => <option key={o} value={o} style={{ background: '#0d0d0d', color: '#fff' }}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ onClick, label }: { onClick?: () => void; label: string }) {
  const [h, setH] = useState(false);
  return (
    <button type={onClick ? 'button' : 'submit'} onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: 1, padding: '11px 20px', borderRadius: 11, border: 'none',
        background: '#fff', color: '#000', fontSize: 13, fontWeight: 400,
        fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
        transition: 'all 0.18s', letterSpacing: '0.02em',
        transform: h ? 'translateY(-1px)' : 'none',
        boxShadow: h ? '0 8px 28px rgba(255,255,255,0.14)' : 'none',
        opacity: h ? 0.92 : 1,
      }}>
      {label} →
    </button>
  );
}

function SubmitBtn({ label }: { label: string }) {
  const [h, setH] = useState(false);
  return (
    <button type="submit"
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        flex: 1, padding: '11px 20px', borderRadius: 11, border: 'none',
        background: '#fff', color: '#000', fontSize: 13, fontWeight: 400,
        fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
        transition: 'all 0.18s', letterSpacing: '0.02em',
        transform: h ? 'translateY(-1px)' : 'none',
        boxShadow: h ? '0 8px 28px rgba(255,255,255,0.14)' : 'none',
        opacity: h ? 0.92 : 1,
      }}>
      {label}
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 42, padding: '11px 0', borderRadius: 11,
        border: '1px solid rgba(255,255,255,0.1)',
        background: h ? 'rgba(255,255,255,0.06)' : 'transparent',
        color: 'rgba(255,255,255,0.45)', fontSize: 14,
        cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0,
      }}>
      ←
    </button>
  );
}
