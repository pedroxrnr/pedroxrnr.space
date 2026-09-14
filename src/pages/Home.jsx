import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import GitHubIcon from '../components/GitHubIcon'
import { projects } from '../data/projects'
import { getArticles, formatArticleDate } from '../data/articles'
import { SKILLS } from '../data/skills'
import { useI18n } from '../i18n/useI18n'

export default function Home() {
  const { lang, t } = useI18n()
  useDocumentTitle(t('home.documentTitle'))

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)
  const latestArticle = getArticles(lang)[0] ?? null

  return (
    <section className="content home-page">
      <h2><span className="prompt">~$</span> {t('home.introHeading')}</h2>

      <p>{t('home.intro')}</p>

      <h3>{t('home.learningHeading')}</h3>

      <p>{t('home.learning')}</p>

      <h3>{t('home.techHeading')}</h3>

      <ul className="tech-chips" aria-label={t('home.techAria')}>
        {SKILLS.map((skill) => (
          <li key={skill}><code>{skill}</code></li>
        ))}
      </ul>

      {featuredProjects.length > 0 && (
        <section className="home-projects">
          <h2><span className="prompt">~$</span> {t('home.projectsHeading')}</h2>

          <p>{t('home.projectsIntro')}</p>

          <div className="projects-grid">
            {featuredProjects.map((project) => (
              <article className="project-card" key={project.name}>
                <a
                  className="project-link"
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t('home.openRepo', { name: project.name })}
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
                        {t('home.github')}
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
          <h2><span className="prompt">~$</span> {t('home.articleHeading')}</h2>

          <p>{t('home.articleIntro')}</p>

          <article className="featured-article">
            <Link
              className="featured-article-link"
              to={`/articles/${latestArticle.slug}`}
              aria-label={t('home.readArticle', { title: latestArticle.meta.title })}
            >
              <div className="featured-article-body">
                <div className="featured-article-head">
                  <h3>{latestArticle.meta.title}</h3>
                  <span className="article-date">
                    {formatArticleDate(latestArticle.meta.dateObj, lang)}
                  </span>
                </div>
                <p className="featured-article-excerpt">{latestArticle.meta.excerpt}</p>
                <div className="featured-article-meta">
                  <div className="featured-article-tags">
                    {latestArticle.meta.tags.map((tag) => (
                      <code key={tag}>{tag}</code>
                    ))}
                  </div>
                  <span className="featured-article-read">{t('home.readLabel')}</span>
                </div>
              </div>
            </Link>
          </article>
        </section>
      )}
    </section>
  )
}
