"use client";
import Link from "next/link";
// GameOfLife.tsx
// Import des dépendances nécessaires
import React, { useState, useEffect, useCallback } from "react";

// Définition du type Cell
type Cell = {
  row: number;
  col: number;
  alive: boolean;
};

// Définition des constantes pour la taille de la grille
const numRows = 30;
const numCols = 50;

// Fonction pour créer une grille vide
// Fonction pour créer une grille vide
const createEmptyGrid = (): Cell[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), (_, j) => ({ row: i, col: j, alive: false }))
    );
  }
  return rows;
};

// Composant principal GameOfLife
const GameOfLife: React.FC = () => {
  // Déclaration des états
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [running, setRunning] = useState<boolean>(false);

  // Fonction pour initialiser la grille
  const initializeGrid = () => {
    setGrid(createEmptyGrid());
  };

  // Fonction pour gérer le clic sur une cellule
  // Fonction pour gérer le clic sur une cellule
  const handleCellClick = (row: number, col: number) => {
    const newGrid = grid.map((rows) =>
      rows.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, alive: !cell.alive }
          : cell
      )
    );
    setGrid(newGrid);
  };

  // Fonction pour lancer ou arrêter la simulation
  const toggleRunning = () => {
    setRunning(!running);
  };

  // Fonction pour réinitialiser la grille
  const resetGrid = () => {
    initializeGrid();
    setRunning(false); // Arrête la simulation si elle est en cours
  };

  // Fonction pour obtenir le nombre de voisins vivants d'une cellule
  const countAliveNeighbors = (row: number, col: number): number => {
    const neighbors = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    return neighbors.reduce((aliveCount, [rowOffset, colOffset]) => {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;

      // Vérifie que les nouvelles coordonnées sont à l'intérieur de la grille
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        // Incrémente le compteur si le voisin est vivant
        aliveCount += grid[newRow][newCol].alive ? 1 : 0;
      }

      return aliveCount;
    }, 0);
  };

  // Fonction pour effectuer une itération de la simulation
  const runSimulation = useCallback(() => {
    const newGrid = grid.map((rows) =>
      rows.map((cell) => {
        const aliveNeighbors = countAliveNeighbors(cell.row, cell.col);
        return {
          ...cell,
          alive: aliveNeighbors === 3 || (cell.alive && aliveNeighbors === 2),
        };
      })
    );
    setGrid(newGrid);
  }, [grid]);

  // Effet secondaire pour gérer la simulation automatique
  useEffect(() => {
    let intervalId: any;

    if (running) {
      intervalId = setInterval(runSimulation, 100); // ajuste la vitesse selon tes préférences
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [running, runSimulation]);

  // Effet secondaire pour initialiser la grille au montage
  useEffect(() => {
    initializeGrid();
  }, []);

  // Rendu du composant
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <div
        className="border border-slate-300"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows) =>
          rows.map((cell) => (
            <div
              className={`border border-slate-300 ${
                cell.alive ? "bg-slate-900" : "bg-white"
              }`}
              key={`${cell.row}-${cell.col}`}
              onClick={() => handleCellClick(cell.row, cell.col)}
              style={{
                width: 20,
                height: 20,
              }}
            />
          ))
        )}
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2">
        <div className="p-1 border-2 border-zinc-200 border-l-zinc-900 border-r-zinc-900 bg-slate-50 rounded-full flex items-center gap-2">
          <button
            className={`${
              running
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-full py-2 px-4 font-semibold`}
            onClick={toggleRunning}
          >
            {running ? "Arrêter" : "Démarrer"}
          </button>
          <button
            className={`bg-slate-500 hover:bg-slate-600 text-white rounded-full py-2 px-4 font-semibold`}
            onClick={resetGrid}
          >
            Réinitialiser
          </button>
          <Link
            href="https://leonelngoya.com"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 font-semibold text-white hover:bg-indigo-600"
          >
            LN
          </Link>
          <Link
            href="https://github.com/ln-dev7"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-800 font-semibold text-white hover:bg-zinc-950"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"
                fill="rgba(255,255,255,1)"
              ></path>
            </svg>
          </Link>
        </div>
        <span className="text-sm bg-amber-600 font-medium text-white rounded-2xl py-1 px-3">Game Of Life</span>
      </div>
    </div>
  );
};

export default GameOfLife;
