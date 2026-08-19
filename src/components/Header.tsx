import "./pages/styles.css";
import logo from "../rbe_logo.svg"; // Assure-toi que ce fichier existe

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <img src={logo} alt="RétroBus Essonne" className="header-logo" />
      </div>
    </header>
  );
}
