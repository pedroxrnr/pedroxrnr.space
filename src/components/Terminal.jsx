export default function Terminal({ title = 'pedro@pedroxrnr: ~', prompt = '$', children }) {
  const lines = String(children).split('\n')

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">
          <span className="terminal-dot" />
          <span className="terminal-dot" />
          <span className="terminal-dot" />
        </span>
        <span className="terminal-title">{title}</span>
      </div>
      <pre className="terminal-body">
        <code>
          {lines.map((line, i) =>
            line.startsWith(prompt + ' ') ? (
              <span className="terminal-line" key={i}>
                <span className="term-prompt">{prompt}</span>
                {line.slice(prompt.length)}
                {i < lines.length - 1 ? '\n' : ''}
              </span>
            ) : (
              <span className="terminal-line" key={i}>
                {line}
                {i < lines.length - 1 ? '\n' : ''}
              </span>
            )
          )}
        </code>
      </pre>
    </div>
  )
}