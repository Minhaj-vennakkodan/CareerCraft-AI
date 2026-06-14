import React, { useState } from 'react';
import { Terminal, Send, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Globe } from 'lucide-react';

export default function PortfolioThemes({ themeName, resume, portfolio }) {
  if (!resume || !portfolio) return null;

  const { 
    personalInfo, 
    summary, 
    experience = [], 
    education = [], 
    skills = [], 
    projects = [], 
    certifications = [],
    achievements = [],
    languages = [],
    customSections = []
  } = resume;
  const { socialLinks = {}, contactEmail } = portfolio;

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [sentStatus, setSentStatus] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSentStatus(true);
    setTimeout(() => {
      setSentStatus(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 2500);
  };

  // Shared Contact Form Component
  const ContactForm = ({ darkTheme = true }) => (
    <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg mx-auto text-left text-xs font-semibold">
      {sentStatus && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-3 rounded-lg text-center font-bold">
          ✉️ Message sent successfully! (Simulated)
        </div>
      )}
      <div>
        <label className={`block mb-1 ${darkTheme ? 'text-slate-400' : 'text-slate-600'}`}>Your Name</label>
        <input 
          type="text" 
          required
          value={contactForm.name} 
          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
          className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
            darkTheme ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        />
      </div>
      <div>
        <label className={`block mb-1 ${darkTheme ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
        <input 
          type="email" 
          required
          value={contactForm.email} 
          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
          className={`w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
            darkTheme ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        />
      </div>
      <div>
        <label className={`block mb-1 ${darkTheme ? 'text-slate-400' : 'text-slate-600'}`}>Your Message</label>
        <textarea 
          rows={4}
          required
          value={contactForm.message} 
          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
          className={`w-full p-4 rounded border focus:outline-none focus:ring-1 focus:ring-brand-purple ${
            darkTheme ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        />
      </div>
      <button 
        type="submit" 
        className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-cyan text-white font-bold hover:brightness-110 flex items-center justify-center gap-1.5 shadow"
      >
        <Send size={14} /> Send Message
      </button>
    </form>
  );

  // ==============================================================
  // THEME 1: MODERN DEVELOPER (CLI Terminal Style)
  // ==============================================================
  const ModernDeveloperTheme = () => (
    <div className="bg-slate-950 text-slate-105 min-h-screen font-mono p-6 md:p-12 text-left selection:bg-brand-cyan selection:text-slate-950">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Terminal Header */}
        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/40 shadow-2xl">
          <div className="bg-slate-900 px-4 py-2 flex items-center gap-1.5 border-b border-slate-850">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-[10px] ml-4 text-slate-500 flex items-center gap-1"><Terminal size={12} /> bash - index.sh</span>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-brand-cyan">~/careercraft $ cat developer_profile.json</p>
            <div className="pl-4 border-l border-brand-purple/20 text-xs sm:text-sm leading-relaxed text-slate-300 space-y-2">
              <p><span className="text-brand-purple-light">"name":</span> "{personalInfo.name || 'John Doe'}",</p>
              <p><span className="text-brand-purple-light">"title":</span> "{personalInfo.title || 'Developer'}",</p>
              <p><span className="text-brand-purple-light">"location":</span> "{personalInfo.location || 'Remote'}",</p>
              <p><span className="text-brand-purple-light">"summary":</span> "{summary}"</p>
            </div>
            {/* Social links */}
            <div className="flex gap-4 pt-4 border-t border-slate-850 text-xs text-brand-cyan font-bold">
              {socialLinks.github && (
                <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                  <Github size={14} /> github/{socialLinks.github}
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                  <Linkedin size={14} /> linkedin
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        {experience.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/experience (history)</h2>
            <div className="space-y-6 font-mono text-xs sm:text-sm">
              {experience.map((exp, i) => (
                <div key={i} className="pl-4 border-l border-brand-purple/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1 font-bold">
                    <span className="text-brand-purple-light">{exp.position} @ {exp.company}</span>
                    <span className="text-slate-500 text-xs font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  {exp.location && <div className="text-[10px] text-slate-500 mb-2">📍 {exp.location}</div>}
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line text-xs">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/projects (list)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="p-5 border border-slate-850 bg-slate-900/20 rounded-xl hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-205 flex items-center gap-1.5">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-brand-cyan">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/skills (tags)</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk, i) => (
                <span key={i} className="px-3 py-1 rounded-lg border border-slate-800 bg-slate-900/40 text-xs text-brand-purple-light font-bold">
                  {sk.name} {sk.level !== 'None' ? `(${sk.level})` : ''}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/education (degrees)</h2>
            <div className="space-y-4 font-mono text-xs sm:text-sm">
              {education.map((edu, i) => (
                <div key={i} className="pl-4 border-l border-brand-purple/20">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-1 font-bold">
                    <span className="text-brand-purple-light">{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-slate-500 text-xs font-normal">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-xs text-slate-400">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/certifications (list)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs sm:text-sm">
              {certifications.map((cert, i) => (
                <div key={i} className="p-4 border border-slate-850 bg-slate-900/10 rounded-xl hover:border-slate-800 transition-colors">
                  <div className="font-bold text-slate-200">{cert.name}</div>
                  <div className="text-slate-500 text-[11px] mt-1">{cert.issuer} • {cert.issueDate}</div>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noreferrer" className="text-brand-cyan text-[10px] flex items-center gap-1 mt-2 hover:underline">
                      <ExternalLink size={10} /> View Certificate
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/achievements (grep "success")</h2>
            <div className="space-y-4 font-mono text-xs">
              {achievements.map((ach, i) => (
                <div key={i} className="pl-4 border-l border-brand-purple/20">
                  <span className="text-brand-purple-light font-bold">🏆 {ach.title}</span>
                  {ach.description && <p className="text-slate-400 mt-1 leading-relaxed">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages && languages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/languages (locale)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              {languages.map((lang, i) => (
                <div key={i} className="p-3 border border-slate-850 bg-slate-900/10 rounded-xl flex justify-between items-center">
                  <span className="text-brand-purple-light font-bold">{lang.name}</span>
                  <span className="text-slate-500 text-[10px]">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-8">
            {customSections.map((sec, i) => (
              <div key={i} className="space-y-6">
                <h2 className="text-xl font-bold border-b border-slate-800 pb-2 text-brand-cyan">~/extra/{sec.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md</h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed whitespace-pre-line font-mono pl-4 border-l border-brand-purple/20">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Contact Form */}
        <div className="space-y-6 pt-6 border-t border-slate-900 text-center">
          <h2 className="text-xl font-bold text-brand-cyan">~/contact_me (send)</h2>
          <ContactForm darkTheme={true} />
        </div>
      </div>
    </div>
  );

  // ==============================================================
  // THEME 2: CLASSIC CORPORATE (Formal White/Blue layout)
  // ===========================================================
  const CorporateTheme = () => (
    <div className="bg-slate-50 text-slate-850 min-h-screen p-6 md:p-12 text-left selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12 bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-6 border-slate-200 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900">{personalInfo.name || 'John Doe'}</h1>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mt-1">{personalInfo.title || 'Executive'}</p>
            {personalInfo.location && <p className="text-xs text-slate-400 mt-1">📍 {personalInfo.location}</p>}
          </div>

          <div className="flex gap-3">
            {socialLinks.github && (
              <a href={`https://github.com/${socialLinks.github}`} target="_blank" rel="noreferrer" className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">
                <Github size={18} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>

        {summary && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-650 pl-3">Professional Summary</h2>
            <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
          </div>
        )}

        {/* Experience Timeline */}
        {experience.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Career History</h2>
            <div className="relative border-l border-slate-200 pl-6 ml-3 space-y-6">
              {experience.map((exp, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[30px] top-1.5 w-4.5 h-4.5 rounded-full border-4 border-white bg-blue-600 shadow" />
                  <div className="flex justify-between items-baseline font-bold text-sm text-slate-900">
                    <span>{exp.position}</span>
                    <span className="text-xs text-slate-400 font-normal">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-xs text-blue-600 font-bold uppercase mt-0.5">{exp.company}</div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Key Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((proj, i) => (
                <div key={i} className="p-5 border border-slate-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">{proj.title}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] text-blue-700 font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Languages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Skills Inventory</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 font-semibold">
                    {sk.name} {sk.level !== 'None' ? `(${sk.level})` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Languages</h2>
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, i) => (
                  <div key={i} className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-900 font-bold">{lang.name}</span>
                    <span className="text-slate-400 font-semibold">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Education & Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {education.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Education</h2>
              <div className="space-y-4">
                {education.map((edu, i) => (
                  <div key={i} className="p-4 border border-slate-150 rounded-xl bg-slate-50/30">
                    <div className="flex justify-between items-baseline font-bold text-sm text-slate-900">
                      <span>{edu.degree}</span>
                      <span className="text-xs text-slate-450 font-normal">{edu.startDate} - {edu.endDate}</span>
                    </div>
                    <div className="text-xs text-blue-605 font-bold uppercase mt-0.5">{edu.institution}</div>
                    {edu.gpa && <p className="text-[11px] text-slate-500 mt-1">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Certifications</h2>
              <div className="space-y-3">
                {certifications.map((cert, i) => (
                  <div key={i} className="p-3 border border-slate-150 rounded-xl bg-slate-50/30 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{cert.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{cert.issuer} • {cert.issueDate}</div>
                    </div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="text-blue-650 hover:text-blue-750">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Key Achievements</h2>
            <div className="space-y-3">
              {achievements.map((ach, i) => (
                <div key={i} className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">🏆 {ach.title}</div>
                  {ach.description && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-6">
            {customSections.map((sec, i) => (
              <div key={i} className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-3">{sec.title}</h2>
                <div className="p-5 border border-slate-205 bg-white rounded-xl shadow-sm text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact form */}
        <div className="space-y-4 pt-6 border-t border-slate-100 text-center">
          <h2 className="text-lg font-bold text-slate-900">Get In Touch</h2>
          <ContactForm darkTheme={false} />
        </div>
      </div>
    </div>
  );

  // Default switcher fallback theme name matching
  if (themeName === 'Corporate') return <CorporateTheme />;
  if (themeName === 'Creative') return <ModernDeveloperTheme />; // Fallback template for simplicity
  if (themeName === 'Minimal') return <CorporateTheme />;          // Light minimalist structure
  if (themeName === 'Dark Professional') return <ModernDeveloperTheme />;

  return <ModernDeveloperTheme />;
}
