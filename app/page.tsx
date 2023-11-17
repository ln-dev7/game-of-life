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
    <div className="relative">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows) =>
          rows.map((cell) => (
            <div
              key={`${cell.row}-${cell.col}`}
              onClick={() => handleCellClick(cell.row, cell.col)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell.alive ? "black" : "white",
                border: "1px solid #ccc",
              }}
            />
          ))
        )}
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white p-1 border-2 rounded-full flex items-center gap-2">
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
      </div>
    </div>
  );
};

export default GameOfLife;
