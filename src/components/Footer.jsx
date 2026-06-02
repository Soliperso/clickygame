import { FiGithub, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>
        Made with <FiHeart className="footer-heart" aria-label="love" /> by Ahmed Chebli
      </p>
      <a
        className="footer-link"
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FiGithub /> Source
      </a>
    </footer>
  );
}
