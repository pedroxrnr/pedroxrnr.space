import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import LinkedInIcon from '../components/LinkedInIcon'
import EmailIcon from '../components/EmailIcon'
import { SKILLS } from '../data/skills'
import { EXPERIENCE } from '../data/experience'

const CONTACTS = [
  { label: 'GitHub', value: 'github.com/pedroxrnr', url: 'https://github.com/pedroxrnr', Icon: GitHubIcon },
  { label: 'LinkedIn', value: 'linkedin.com/in/pedroxrnr', url: 'https://linkedin.com/in/pedroxrnr', Icon: LinkedInIcon },
  { label: 'Email', value: 'renerpedro@gmail.com', url: 'mailto:renerpedro@gmail.com', Icon: EmailIcon },
]

export default function About() {
  useDocumentTitle('About')

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> About</h2>

      <h3>Bio</h3>
      <p>[ bio em breve ]</p>

      <h3>Skills</h3>
      <ul className="tech-chips" aria-label="Technologies and skills">
        {SKILLS.map((skill) => (
          <li key={skill}><code>{skill}</code></li>
        ))}
      </ul>

      {EXPERIENCE.length > 0 && (
        <>
          <h3>Experience</h3>
          <div className="experience">
            {EXPERIENCE.map(({ company, role, period, description }) => (
              <article className="experience-item" key={company}>
                <div className="experience-head">
                  <h4 className="experience-company">{company}</h4>
                  <span className="experience-date">{period}</span>
                </div>
                <p className="experience-role">{role}</p>
                <p className="experience-desc">{description}</p>
              </article>
            ))}
          </div>
        </>
      )}

      <h3>Contact</h3>
      <div className="about-contact">
        <div className="about-contact-command">
          <span className="term-prompt">~$</span>
          <span>cat ~/.contact</span>
        </div>
        <ul className="about-contact-links">
          {CONTACTS.map(({ label, value, url, Icon }) => (
            <li key={label}>
              <a
                href={url}
                aria-label={`${label}: ${value}`}
                title={label}
                {...(url.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
              >
                <span className="about-contact-icon"><Icon /></span>
                <span className="about-contact-name">{label}</span>
                <span className="about-contact-handle">{value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}