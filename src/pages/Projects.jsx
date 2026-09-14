import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import { projects } from '../data/projects'
import { useI18n } from '../i18n/useI18n'

export default function Projects() {
  const { t } = useI18n()
  useDocumentTitle(t('projects.documentTitle'))

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> {t('projects.heading')}</h2>

      <p>{t('projects.intro')}</p>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="projects-empty">{t('projects.empty')}</p>
        ) : (
          projects.map((project) => (
            <article className="project-card" key={project.name}>
              <a
                className="project-link"
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={t('projects.openRepo', { name: project.name })}
              >
                <div className="project-body">
                  <h3 className="project-title">./{project.name}</h3>
                  <div className="project-tech">
                    {(project.tech ?? []).map((tech) => (
                      <code key={tech}>{tech}</code>
                    ))}
                  </div>
                  <p>{project.desc}</p>
                  <div className="project-meta">
                    <span className="project-date">{project.date}</span>
                    <span className="project-repo">
                      <GitHubIcon />
                      {t('projects.github')}
                    </span>
                  </div>
                </div>
              </a>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
