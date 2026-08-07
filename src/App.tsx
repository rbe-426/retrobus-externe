import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import Header from "../components/Header";
import "./styles.css";

function App() {
  return (
    <>
      <Header />
      <main className="page-body">
        <h1>Bienvenue chez RétroBus Essonne</h1>
        <p>
          Ceci est le corps de la page, avec un header fixe en haut et un logo discret en arrière-plan.
        </p>
        <p>
          Tu peux ajouter ici du contenu, des sections, des cartes ou des images pour présenter l’association.
        </p>
      </main>
    </>
  );
}

export default App;
