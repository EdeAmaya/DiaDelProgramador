import React, { useState } from "react";
import Inicio from "../components/Inicio";
import Leaderboard from "../components/Leaderboard";
import GameSelector from "../components/GameSelector";

const SquidGames = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState("inicio");

  const renderPage = () => {
    switch(currentPage) {
      case "inicio":
        return <Inicio onNavigate={setCurrentPage} onLogout={onLogout} />;
      case "leaderboard":
        return <Leaderboard onNavigate={setCurrentPage} />;
      case "games":
        return <GameSelector onNavigate={setCurrentPage} />;
      default:
        return <Inicio onNavigate={setCurrentPage} onLogout={onLogout} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default SquidGames;