import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import LinkedInIcon from '../components/LinkedInIcon'
import EmailIcon from '../components/EmailIcon'
import { ABOUT_SKILLS } from '../data/skills'
import { EXPERIENCE } from '../data/experience'
import { useI18n } from '../i18n/useI18n'

const CONTACTS = [
  { label: 'GitHub', value: 'github.com/pedroxrnr', url: 'https://github.com/pedroxrnr', Icon: GitHubIcon },
  { label: 'LinkedIn', value: 'linkedin.com/in/pedroxrnr', url: 'https://linkedin.com/in/pedroxrnr', Icon: LinkedInIcon },
  { label: 'Email', value: 'renerpedro@gmail.com', url: 'mailto:renerpedro@gmail.com', Icon: EmailIcon },
]

const SKILL_KEYS = {
  Networking: 'networking',
}

export default function About() {
  const { t } = useI18n()
  useDocumentTitle(t('about.documentTitle'))

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> {t('about.heading')}</h2>

      <h3>{t('about.bioHeading')}</h3>
      <p>{t('about.bio1')}</p>
      <p>{t('about.bio2')}</p>
      <p>{t('about.bio3')}</p>
      <p className="bio-meta">{t('about.bioMeta')}</p>

      <h3>{t('about.skillsHeading')}</h3>
      <ul className="tech-chips" aria-label={t('about.skillsAria')}>
        {ABOUT_SKILLS.map((skill) => {
          const label = SKILL_KEYS[skill] ? t(`skills.${SKILL_KEYS[skill]}`) : skill
          return (
            <li key={skill}><code>{label}</code></li>
          )
        })}
      </ul>

      {EXPERIENCE.length > 0 && (
        <>
          <h3>{t('about.experienceHeading')}</h3>
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

      <h3>{t('about.contactHeading')}</h3>
      <div className="about-contact">
        <div className="about-contact-command">
          <span className="term-prompt">~$</span>
          <span>{t('about.contactCommand')}</span>
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
