import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import { projects } from '../data/projects'

export default function Projects() {
  useDocumentTitle('Projects')

  return (
    <section className="content">
      <h2><span className="prompt">~$</span> Projects</h2>

      <p>
        Tools and projects I'm building along my cybersecurity journey, choose one to jump
        straight to the source code on GitHub.
      </p>

      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="projects-empty">No public projects yet, check back soon.</p>
        ) : (
          projects.map((project) => (
            <article className="project-card" key={project.name}>
              <a
                className="project-link"
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${project.name} repository on GitHub`}
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
                      github
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