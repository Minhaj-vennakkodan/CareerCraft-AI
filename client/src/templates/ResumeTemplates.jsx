import React from 'react';

export default function ResumeTemplates({ resume }) {
  if (!resume) return null;

  const { 
    personalInfo, 
    summary, 
    education = [], 
    experience = [], 
    skills = [], 
    projects = [], 
    certifications = [], 
    achievements = [], 
    languages = [], 
    customSections = [], 
    fontName, 
    primaryColor, 
    spacing 
  } = resume;

  // Resolve Font styles
  let fontClass = 'font-sans';
  if (fontName === 'Outfit') fontClass = 'font-outfit tracking-wide';
  if (fontName === 'Inter') fontClass = 'font-inter';
  if (fontName === 'Playfair Display') fontClass = 'font-serif';
  if (fontName === 'Fira Code') fontClass = 'font-mono text-xs';

  // Resolve Line spacings and margins
  let containerPadding = 'p-6';
  let sectionSpacing = 'space-y-5';
  let itemSpacing = 'space-y-4';
  
  if (spacing === 'Tight') {
    containerPadding = 'p-4';
    sectionSpacing = 'space-y-3';
    itemSpacing = 'space-y-2';
  } else if (spacing === 'Loose') {
    containerPadding = 'p-10';
    sectionSpacing = 'space-y-8';
    itemSpacing = 'space-y-6';
  }

  // ==============================================================
  // 1. MODERN SIDEBAR TEMPLATE
  // ==============================================================
  const ModernTemplate = () => (
    <div className={`grid grid-cols-3 gap-6 text-left ${fontClass} text-slate-800 h-full min-h-[1056px] ${containerPadding}`}>
      {/* Left Column (Sidebar) */}
      <div className="col-span-1 border-r pr-6 space-y-6" style={{ borderColor: `${primaryColor}20` }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: primaryColor }}>{personalInfo.name || 'John Doe'}</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">{personalInfo.title || 'Developer'}</p>
        </div>

        {/* Contact info */}
        <div className="space-y-2.5 text-[11px] font-medium break-all">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Contact</h3>
          {personalInfo.email && <p>✉️ {personalInfo.email}</p>}
          {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
          {personalInfo.location && <p>📍 {personalInfo.location}</p>}
          {personalInfo.linkedin && <p>🔗 {personalInfo.linkedin}</p>}
          {personalInfo.github && <p>🐙 {personalInfo.github}</p>}
          {personalInfo.website && <p>🌐 {personalInfo.website}</p>}
        </div>

        {/* Skills List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((sk, i) => (
              <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                {sk.name} {sk.level !== 'None' ? `(${sk.level})` : ''}
              </span>
            ))}
          </div>
        </div>

        {/* Languages List */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Languages</h3>
            <div className="space-y-1">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] text-slate-700 font-semibold">
                  <span>{lang.name}</span>
                  <span className="text-slate-400 text-[9px] font-normal">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Details) */}
      <div className={`col-span-2 ${sectionSpacing}`}>
        {summary && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Professional Summary</h3>
            <p className="text-xs leading-relaxed text-slate-600">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Experience</h3>
            <div className={itemSpacing}>
              {experience.map((exp, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.position}</span>
                    <span className="text-[10px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-505 font-bold uppercase">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  <p className="text-[11px] mt-1.5 leading-relaxed whitespace-pre-line text-slate-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Projects</h3>
            <div className={itemSpacing}>
              {projects.map((proj, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.title}</span>
                    {proj.link && <span className="text-[10px] text-slate-500">{proj.link}</span>}
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="text-[9px] text-brand-purple font-bold tracking-wide uppercase mt-0.5">Tech: {proj.technologies.join(', ')}</div>
                  )}
                  <p className="text-[11px] mt-1 leading-relaxed whitespace-pre-line text-slate-600">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Education</h3>
            <div className={itemSpacing}>
              {education.map((edu, i) => (
                <div key={i} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="text-[10px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-[10px] text-slate-505 font-bold uppercase">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>Achievements</h3>
            <div className={itemSpacing}>
              {achievements.map((ach, i) => (
                <div key={i} className="text-xs">
                  <div className="font-bold text-slate-900">{ach.title}</div>
                  {ach.description && <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-4 pt-2">
            {customSections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>{sec.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line">{sec.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ==============================================================
  // 2. PROFESSIONAL EXECUTIVE TEMPLATE (Classic center)
  // ==============================================================
  const ProfessionalTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-800 h-full min-h-[1056px] ${containerPadding} ${sectionSpacing}`}>
      <div className="text-center space-y-1.5 border-b-2 pb-4" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">{personalInfo.name || 'John Doe'}</h1>
        <p className="text-xs uppercase font-extrabold tracking-wider" style={{ color: primaryColor }}>{personalInfo.title || 'Executive'}</p>
        <div className="flex flex-wrap justify-center gap-4 text-[10px] text-slate-500 font-medium mt-1">
          {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Summary Statement</h3>
          <p className="text-xs leading-relaxed text-slate-600">{summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Experience</h3>
          <div className={itemSpacing}>
            {experience.map((exp, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.position} — <span className="font-semibold text-slate-600">{exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Projects</h3>
          <div className={itemSpacing}>
            {projects.map((proj, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-slate-550 font-normal">{proj.link}</span>}
                </div>
                <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {education.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Education</h3>
            <div className="space-y-3">
              {education.map((edu, i) => (
                <div key={i} className="text-[11px]">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Skills Summary</h3>
            <div className="flex flex-wrap gap-1">
              {skills.map((sk, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {sk.name}
                </span>
              ))}
            </div>

            {languages && languages.length > 0 && (
              <div className="pt-3 space-y-1.5">
                <h4 className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Languages</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {languages.map((lang, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] border-b border-slate-100 pb-0.5 font-semibold text-slate-800">
                      <span>{lang.name}</span>
                      <span className="text-slate-450 font-normal">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {achievements && achievements.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>Achievements</h3>
          <div className={itemSpacing}>
            {achievements.map((ach, i) => (
              <div key={i} className="text-xs">
                <div className="font-bold text-slate-900">{ach.title}</div>
                {ach.description && <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{ach.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <div className="space-y-4 pt-2">
          {customSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider border-b pb-1 text-slate-900" style={{ borderColor: `${primaryColor}30` }}>{sec.title}</h3>
              <p className="text-xs leading-relaxed text-slate-650 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 3. MINIMAL ELEGANT TEMPLATE (Minimal layout)
  // ==============================================================
  const MinimalTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-800 h-full min-h-[1056px] ${containerPadding} ${sectionSpacing}`}>
      <div className="flex justify-between items-baseline border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{personalInfo.name || 'John Doe'}</h1>
          <p className="text-xs text-slate-500 uppercase font-semibold">{personalInfo.title || 'Developer'}</p>
        </div>
        <div className="text-right text-[10px] text-slate-500 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.location && <p>{personalInfo.location}</p>}
        </div>
      </div>

      {summary && (
        <p className="text-xs leading-relaxed text-slate-600">{summary}</p>
      )}

      {experience.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Experience</span>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i} className="text-xs grid grid-cols-4 gap-4">
                <span className="col-span-1 text-[10px] text-slate-500">{exp.startDate} - {exp.endDate}</span>
                <div className="col-span-3">
                  <div className="font-bold text-slate-900">{exp.position} <span className="font-normal text-slate-505">at {exp.company}</span></div>
                  <p className="text-[11px] mt-1 text-slate-600 whitespace-pre-line">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Projects</span>
          <div className="space-y-4">
            {projects.map((proj, i) => (
              <div key={i} className="text-xs grid grid-cols-4 gap-4">
                <span className="col-span-1 text-[10px] text-slate-500">{proj.link || 'Repository'}</span>
                <div className="col-span-3">
                  <div className="font-bold text-slate-900">{proj.title}</div>
                  <p className="text-[11px] mt-1 text-slate-600 whitespace-pre-line">{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Education</span>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i} className="text-xs grid grid-cols-4 gap-4">
                <span className="col-span-1 text-[10px] text-slate-500">{edu.startDate} - {edu.endDate}</span>
                <div className="col-span-3 font-semibold text-slate-800">
                  {edu.degree} in {edu.fieldOfStudy} • <span className="font-normal text-slate-500">{edu.institution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {achievements && achievements.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Achievements</span>
          <div className="space-y-3">
            {achievements.map((ach, i) => (
              <div key={i} className="text-xs grid grid-cols-4 gap-4">
                <span className="col-span-1 text-[10px] text-slate-500">Recognition</span>
                <div className="col-span-3">
                  <div className="font-bold text-slate-900">{ach.title}</div>
                  {ach.description && <p className="text-[11px] mt-1 text-slate-600 whitespace-pre-line">{ach.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {languages && languages.length > 0 && (
        <div className="space-y-3 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Languages</span>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <span className="col-span-1 text-[10px] text-slate-500">Fluency</span>
            <div className="col-span-3 flex flex-wrap gap-x-6 gap-y-1">
              {languages.map((lang, i) => (
                <span key={i} className="font-semibold text-slate-800">
                  {lang.name} <span className="font-normal text-slate-450">({lang.proficiency})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {customSections && customSections.length > 0 && (
        <div className="space-y-4 pt-2">
          {customSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">{sec.title}</span>
              <div className="grid grid-cols-4 gap-4 text-xs">
                <span className="col-span-1 text-[10px] text-slate-500">Custom</span>
                <div className="col-span-3 text-slate-600 whitespace-pre-line leading-relaxed">
                  {sec.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 4. CLASSIC CORPORATE TEMPLATE
  // ==============================================================
  const CorporateTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-900 h-full min-h-[1056px] ${containerPadding} ${sectionSpacing}`}>
      {/* Centered Header */}
      <div className="text-center space-y-1 border-b pb-4" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl font-extrabold tracking-tight uppercase" style={{ color: primaryColor }}>{personalInfo.name || 'John Doe'}</h1>
        <p className="text-sm font-semibold tracking-widest text-slate-500 uppercase">{personalInfo.title || 'Corporate Professional'}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium mt-2">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>in: {personalInfo.linkedin.replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>}
          {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Professional Summary</h2>
          <p className="text-xs leading-relaxed text-slate-700 italic">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Professional Experience</h2>
          <div className={itemSpacing}>
            {experience.map((exp, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.position}</span>
                  <span className="text-slate-500 font-normal">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 font-semibold italic mt-0.5">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <p className="text-[11px] mt-1 leading-relaxed text-slate-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Key Projects</h2>
          <div className={itemSpacing}>
            {projects.map((proj, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-slate-500 font-normal">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <div className="text-[10px] text-slate-600 italic mt-0.5">Technologies: {proj.technologies.join(', ')}</div>
                )}
                <p className="text-[11px] mt-1 leading-relaxed text-slate-700 whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Education</h2>
          <div className={itemSpacing}>
            {education.map((edu, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 mt-0.5">
                  <span>{edu.institution}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Key Competencies & Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-800">
            {skills.map((sk, i) => (
              <div key={i} className="flex items-center gap-1 font-semibold">
                <span className="text-[9px]" style={{ color: primaryColor }}>■</span>
                <span>{sk.name}</span>
                {sk.level !== 'None' && <span className="text-[10px] text-slate-500 font-normal">({sk.level})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two column small sections: Languages & Certifications */}
      <div className="grid grid-cols-2 gap-6 pt-2">
        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Languages</h2>
            <div className="space-y-1">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-700">
                  <span className="font-bold">{lang.name}</span>
                  <span className="italic text-slate-500">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>Achievements</h2>
            <div className="space-y-1">
              {achievements.map((ach, i) => (
                <div key={i} className="text-xs text-slate-700">
                  <span className="font-bold">{ach.title}</span>
                  {ach.description && <span className="text-slate-500"> — {ach.description}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections && customSections.length > 0 && (
        <div className="space-y-4 pt-2">
          {customSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: primaryColor, borderColor: `${primaryColor}40` }}>{sec.title}</h2>
              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 5. BOLD CREATIVE TEMPLATE
  // ==============================================================
  const CreativeTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-800 h-full min-h-[1056px] flex flex-col relative`}>
      {/* Bold Top Banner */}
      <div className="p-8 text-white flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight font-serif uppercase">{personalInfo.name || 'John Doe'}</h1>
          <p className="text-xs tracking-widest opacity-90 uppercase font-bold">{personalInfo.title || 'Creative Professional'}</p>
        </div>
        <div className="text-right text-[11px] font-medium opacity-95 space-y-1">
          {personalInfo.email && <p>✉ {personalInfo.email}</p>}
          {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
          {personalInfo.location && <p>📍 {personalInfo.location}</p>}
          {personalInfo.linkedin && <p>🔗 {personalInfo.linkedin}</p>}
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-6 flex-1 ${containerPadding}`}>
        {/* Left narrower column */}
        <div className="col-span-1 space-y-6">
          {/* Skills with custom pills */}
          {skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider border-l-4 pl-2" style={{ borderLeftColor: primaryColor, color: primaryColor }}>Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider border-l-4 pl-2" style={{ borderLeftColor: primaryColor, color: primaryColor }}>Education</h3>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{edu.institution}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider border-l-4 pl-2" style={{ borderLeftColor: primaryColor, color: primaryColor }}>Languages</h3>
              <div className="space-y-2">
                {languages.map((lang, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-bold text-slate-900">{lang.name}</div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div className="h-full rounded-full" style={{ 
                        backgroundColor: primaryColor, 
                        width: lang.proficiency?.toLowerCase().includes('native') ? '100%' : 
                               lang.proficiency?.toLowerCase().includes('fluent') ? '90%' :
                               lang.proficiency?.toLowerCase().includes('professional') ? '75%' :
                               lang.proficiency?.toLowerCase().includes('intermediate') ? '50%' : '30%'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right wider column */}
        <div className={`col-span-2 ${sectionSpacing}`}>
          {summary && (
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider border-b-2 pb-1" style={{ borderBottomColor: `${primaryColor}30`, color: primaryColor }}>About Me</h3>
              <p className="text-xs leading-relaxed text-slate-600 font-medium">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider border-b-2 pb-1" style={{ borderBottomColor: `${primaryColor}30`, color: primaryColor }}>Experience</h3>
              <div className={itemSpacing}>
                {experience.map((exp, i) => (
                  <div key={i} className="text-xs relative pl-4 border-l-2" style={{ borderLeftColor: `${primaryColor}30` }}>
                    <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1" style={{ backgroundColor: primaryColor }}></div>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.position}</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{exp.company} {exp.location && `| ${exp.location}`}</div>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-slate-600 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider border-b-2 pb-1" style={{ borderBottomColor: `${primaryColor}30`, color: primaryColor }}>Projects</h3>
              <div className={itemSpacing}>
                {projects.map((proj, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{proj.title}</span>
                      {proj.link && <span className="text-[10px] text-slate-400 font-normal">{proj.link}</span>}
                    </div>
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded font-semibold text-slate-600 bg-slate-100">{t}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] mt-1.5 leading-relaxed text-slate-605 whitespace-pre-line">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider border-b-2 pb-1" style={{ borderBottomColor: `${primaryColor}30`, color: primaryColor }}>Achievements</h3>
              <div className={itemSpacing}>
                {achievements.map((ach, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-bold text-slate-900">{ach.title}</div>
                    {ach.description && <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{ach.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections && customSections.length > 0 && (
            <div className="space-y-4">
              {customSections.map((sec, i) => (
                <div key={i} className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider border-b-2 pb-1" style={{ borderBottomColor: `${primaryColor}30`, color: primaryColor }}>{sec.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-650 whitespace-pre-line">{sec.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ==============================================================
  // 6. TECHNICAL DEVELOPER TEMPLATE
  // ==============================================================
  const DeveloperTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-800 h-full min-h-[1056px] bg-[#fafafa] ${containerPadding} ${sectionSpacing}`}>
      {/* Developer CLI style Header */}
      <div className="border border-slate-300 rounded p-4 bg-slate-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 right-3 flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
        </div>
        <div className="text-[10px] text-slate-400 mb-2">// config.json</div>
        <div className="space-y-1">
          <div className="text-lg font-bold text-slate-900">&gt; name: &quot;{personalInfo.name || 'John Doe'}&quot;</div>
          <div className="text-slate-600 font-bold">&gt; role: &quot;{personalInfo.title || 'Full Stack Engineer'}&quot;</div>
          <div className="text-[11px] text-slate-500 mt-2 space-y-0.5">
            {personalInfo.email && <p>&gt; email: &quot;{personalInfo.email}&quot;</p>}
            {personalInfo.phone && <p>&gt; phone: &quot;{personalInfo.phone}&quot;</p>}
            {personalInfo.location && <p>&gt; location: &quot;{personalInfo.location}&quot;</p>}
            {personalInfo.linkedin && <p>&gt; linkedin: &quot;{personalInfo.linkedin}&quot;</p>}
            {personalInfo.github && <p>&gt; github: &quot;{personalInfo.github}&quot;</p>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="space-y-1.5">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;summary&gt;</div>
          <p className="leading-relaxed text-slate-700 pl-4 border-l border-slate-300">{summary}</p>
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/summary&gt;</div>
        </div>
      )}

      {/* Skills Grid - Prioritized for Developer */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;skills-inventory&gt;</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pl-4">
            {skills.map((sk, i) => (
              <div key={i} className="flex justify-between items-center text-slate-700 border-b border-slate-100 pb-0.5">
                <span className="font-bold">&gt; {sk.name}</span>
                <span className="text-[10px] text-slate-400">[{sk.level}]</span>
              </div>
            ))}
          </div>
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/skills-inventory&gt;</div>
        </div>
      )}

      {/* Key Projects - Prioritized for Developer */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;featured-projects&gt;</div>
          <div className="space-y-4 pl-4 border-l border-slate-300">
            {projects.map((proj, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">[ {proj.title} ]</span>
                  {proj.link && <span className="text-[10px] text-blue-600 underline">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <div className="text-[10px] text-brand-purple font-semibold">
                    $ stack --include={proj.technologies.join(',')}
                  </div>
                )}
                <p className="text-[11px] leading-relaxed text-slate-650">{proj.description}</p>
              </div>
            ))}
          </div>
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/featured-projects&gt;</div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;experience-history&gt;</div>
          <div className="space-y-4 pl-4 border-l border-slate-300">
            {experience.map((exp, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span># {exp.position} @ {exp.company}</span>
                  <span className="text-[10px] font-normal text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                {exp.location && <div className="text-[10px] text-slate-400"># location: {exp.location}</div>}
                <p className="text-[11px] leading-relaxed text-slate-650 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/experience-history&gt;</div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;education&gt;</div>
          <div className="space-y-2 pl-4 border-l border-slate-300">
            {education.map((edu, i) => (
              <div key={i} className="text-xs">
                <div className="font-bold text-slate-900">{edu.degree} - {edu.fieldOfStudy}</div>
                <div className="text-slate-600">{edu.institution} ({edu.startDate} - {edu.endDate}){edu.gpa && ` • GPA: ${edu.gpa}`}</div>
              </div>
            ))}
          </div>
          <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/education&gt;</div>
        </div>
      )}

      {/* Languages & Achievements */}
      <div className="grid grid-cols-2 gap-6 pl-4">
        {languages && languages.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;languages&gt;</div>
            <div className="space-y-1">
              {languages.map((lang, i) => (
                <div key={i} className="text-[11px] text-slate-700">
                  - {lang.name}: &quot;{lang.proficiency}&quot;
                </div>
              ))}
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;achievements&gt;</div>
            <div className="space-y-1">
              {achievements.map((ach, i) => (
                <div key={i} className="text-[11px] text-slate-700">
                  - {ach.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;{sec.title.toLowerCase().replace(/\s+/g, '-')}&gt;</div>
              <p className="pl-4 leading-relaxed text-slate-650 whitespace-pre-line">{sec.content}</p>
              <div className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">&lt;/{sec.title.toLowerCase().replace(/\s+/g, '-')}&gt;</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 7. ACADEMIC CV TEMPLATE
  // ==============================================================
  const AcademicTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-900 h-full min-h-[1056px] ${containerPadding} ${sectionSpacing}`}>
      {/* Formal Centered Header */}
      <div className="text-center space-y-1 pb-4 border-b border-double border-slate-900">
        <h1 className="text-2xl font-bold uppercase tracking-wide">{personalInfo.name || 'John Doe'}</h1>
        <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">{personalInfo.title || 'Researcher / Academic'}</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[11px] text-slate-600 mt-2">
          {personalInfo.email && <span>Email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
          {personalInfo.location && <span>Address: {personalInfo.location}</span>}
          {personalInfo.website && <span>CV: {personalInfo.website}</span>}
        </div>
      </div>

      {/* Publications / Research Summary */}
      {summary && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">Research & Professional Profile</h2>
          <p className="text-xs leading-relaxed text-slate-700">{summary}</p>
        </div>
      )}

      {/* Education - Top priority in Academic CV */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">Education</h2>
          <div className={itemSpacing}>
            {education.map((edu, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="font-semibold text-slate-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-[11px] text-slate-700 mt-0.5">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience / Academic Appointments */}
      {experience.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">Academic & Professional Appointments</h2>
          <div className={itemSpacing}>
            {experience.map((exp, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.position}</span>
                  <span className="font-semibold text-slate-500">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5">{exp.company} {exp.location && `• ${exp.location}`}</div>
                <p className="text-[11px] mt-1 leading-relaxed text-slate-700 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Research Projects */}
      {projects.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">Selected Research & Projects</h2>
          <div className={itemSpacing}>
            {projects.map((proj, i) => (
              <div key={i} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  {proj.link && <span className="text-[10px] text-slate-500 font-normal">{proj.link}</span>}
                </div>
                {proj.technologies?.length > 0 && (
                  <div className="text-[10px] text-slate-500 italic">Methodologies: {proj.technologies.join(', ')}</div>
                )}
                <p className="text-[11px] mt-1 leading-relaxed text-slate-700 whitespace-pre-line">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills / Methods */}
      {skills.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">Methodology & Skills</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-800">
            {skills.map((sk, i) => (
              <div key={i} className="font-semibold">
                • {sk.name} {sk.level !== 'None' && <span className="text-slate-500 font-normal">({sk.level})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections / Publications etc. */}
      {customSections && customSections.length > 0 && (
        <div className="space-y-4 pt-2">
          {customSections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-0.5 border-slate-800">{sec.title}</h2>
              <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{sec.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==============================================================
  // 8. VIBRANT STARTUP TEMPLATE
  // ==============================================================
  const StartupTemplate = () => (
    <div className={`text-left ${fontClass} text-slate-800 h-full min-h-[1056px] ${containerPadding} ${sectionSpacing} flex flex-col`}>
      {/* Fancy Banner */}
      <div className="rounded-2xl p-6 text-white flex justify-between items-start" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)` }}>
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded bg-white/20 text-[9px] font-bold uppercase tracking-wider">Available Immediately</span>
          <h1 className="text-2xl font-black tracking-tight">{personalInfo.name || 'John Doe'}</h1>
          <p className="text-xs tracking-wider opacity-90 uppercase font-semibold">{personalInfo.title || 'Product Developer'}</p>
        </div>
        <div className="text-right text-[10px] space-y-0.5 bg-black/10 p-3 rounded-lg border border-white/10">
          {personalInfo.email && <p>✉ {personalInfo.email}</p>}
          {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
          {personalInfo.location && <p>📍 {personalInfo.location}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-4 flex-1">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Core Expertise</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((sk, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200 shadow-sm">
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Education</h3>
              <div className="space-y-3">
                {education.map((edu, i) => (
                  <div key={i} className="text-xs">
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">{edu.institution}</div>
                    <div className="text-[10px] text-slate-400">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Languages</h3>
              <div className="space-y-1">
                {languages.map((lang, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold">{lang.name}</span>
                    <span className="text-[10px] text-slate-505 bg-slate-100 px-1 rounded">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className={`col-span-2 ${sectionSpacing}`}>
          {/* Summary */}
          {summary && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Profile</h3>
              <p className="text-xs leading-relaxed text-slate-650 font-medium">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Experience</h3>
              <div className={itemSpacing}>
                {experience.map((exp, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.position}</span>
                      <span className="text-[10px] text-slate-505">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <div className="text-[10px] font-bold" style={{ color: primaryColor }}>{exp.company}</div>
                    <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Projects</h3>
              <div className={itemSpacing}>
                {projects.map((proj, i) => (
                  <div key={i} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{proj.title}</span>
                      {proj.link && <span className="text-[10px] text-slate-500 font-normal">{proj.link}</span>}
                    </div>
                    {proj.technologies?.length > 0 && (
                      <div className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">Stack: {proj.technologies.join(', ')}</div>
                    )}
                    <p className="text-[11px] mt-1 leading-relaxed text-slate-600 whitespace-pre-line">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customSections && customSections.length > 0 && (
            <div className="space-y-4">
              {customSections.map((sec, i) => (
                <div key={i} className="space-y-1.5">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{sec.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 whitespace-pre-line">{sec.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Default switcher fallback rendering template
  if (resume.templateName === 'Professional') return <ProfessionalTemplate />;
  if (resume.templateName === 'Minimal') return <MinimalTemplate />;
  if (resume.templateName === 'Corporate') return <CorporateTemplate />;
  if (resume.templateName === 'Creative') return <CreativeTemplate />;
  if (resume.templateName === 'Developer') return <DeveloperTemplate />;
  if (resume.templateName === 'Academic') return <AcademicTemplate />;
  if (resume.templateName === 'Startup') return <StartupTemplate />;
  
  return <ModernTemplate />;
}
