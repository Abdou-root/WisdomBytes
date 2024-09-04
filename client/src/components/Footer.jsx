{/* Footer component of the frontend */}

import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/AI">AI</Link></li>
        <li><Link to="/posts/categories/Frontend">Frontend</Link></li>
        <li><Link to="/posts/categories/Git">Git</Link></li>
        <li><Link to="/posts/categories/Practices">Practices</Link></li>
        <li><Link to="/posts/categories/CyberSec">CyberSec</Link></li>
        <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
        <li><Link to="/posts/categories/Entertainment">Entertainment</Link></li>
      </ul>
      <div className="footer__copyright">
        <small> &copy; Abdou-Root</small>
      </div>
    </footer>
  )
}

export default Footer