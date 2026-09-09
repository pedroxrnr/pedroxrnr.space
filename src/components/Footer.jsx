export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <p className="footer-copy">&copy; {year} pedroxrnr. All rights reserved.</p>
      <p className="footer-updated">last update: {__LAST_UPDATE__}</p>
    </footer>
  )
}
