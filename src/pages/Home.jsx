import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import { projects } from '../data/projects'
import { articles } from '../data/articles'
import { SKILLS } from '../data/skills'

const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)
const latestArticle = articles[0] ?? null

export default function Home() {
  useDocumentTitle('Home')

  return (
    <section className="content home-page">
      <h2><span className="prompt">~$</span> Introduction</h2>

      <p>
        Hi! I'm Pedro, an Information Systems student passionate about cybersecurity.
        This portfolio showcases the tools I build, the articles I write, and the projects I'm working on.
      </p>

      <h3>What I'm Learning</h3>

      <p>
        I'm currently focused on Python and cybersecurity fundamentals, threat detection, incident response, and
        defensive security while building practical experience through hands-on labs and personal projects.
      </p>

      <h3>Technologies</h3>

      <ul className="tech-chips" aria-label="Technologies">
        {SKILLS.map((skill) => (
          <li key={skill}><code>{skill}</code></li>
        ))}
      </ul>

      {featuredProjects.length > 0 && (
        <section className="home-projects">
          <h2><span className="prompt">~$</span> Favorite Projects</h2>

          <p>A quick look at my favorite projects. Click a card to jump straight to the source on GitHub.</p>

          <div className="projects-grid">
            {featuredProjects.map((project) => (
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
            ))}
          </div>
        </section>
      )}

      {latestArticle && (
        <section className="home-article">
          <h2><span className="prompt">~$</span> Latest Article</h2>

          <p>My most recent article. Click the card to read the full post.</p>

          <article className="featured-article">
            <Link
              className="featured-article-link"
              to={`/articles/${latestArticle.slug}`}
              aria-label={`Read ${latestArticle.meta.title}`}
            >
              <div className="featured-article-body">
                <div className="featured-article-head">
                  <h3>{latestArticle.meta.title}</h3>
                  <span className="article-date">{latestArticle.meta.dateLabel}</span>
                </div>
                <p className="featured-article-excerpt">{latestArticle.meta.excerpt}</p>
                <div className="featured-article-meta">
                  <div className="featured-article-tags">
                    {latestArticle.meta.tags.map((t) => (
                      <code key={t}>{t}</code>
                    ))}
                  </div>
                  <span className="featured-article-read">[ read article ]</span>
                </div>
              </div>
            </Link>
          </article>
        </section>
      )}
    </section>
  )
}
