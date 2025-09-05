import React, { useState } from "react";
import Inicio from "../components/Inicio";
import Leaderboard from "../components/Leaderboard";
import GameSelector from "../components/GameSelector";
import AdminPanel from "../components/AdminPanel";

const SquidGames = () => {
  const [currentPage, setCurrentPage] = useState("inicio");

  const renderPage = () => {
    switch(currentPage) {
      case "inicio":
        return <Inicio onNavigate={setCurrentPage} />;
      case "leaderboard":
        return <Leaderboard onNavigate={setCurrentPage} />;
      case "games":
        return <GameSelector onNavigate={setCurrentPage} />;
      case "admin":
        return <AdminPanel onNavigate={setCurrentPage} />;
      default:
        return <Inicio onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
};

export default SquidGames;