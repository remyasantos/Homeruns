"use client";

import React from 'react';

export default function Page() {
  // We use a simple array to avoid any TypeScript "shape" errors
  const players = [
    { name: "Yordan Alvarez", odds: "+270" },
    { name: "Ozzie Albies", odds: "+570" },
    { name: "Aaron Judge", odds: "+310" }
  ];

  return (
    <div style={{ 
      backgroundColor: '#0a0a0f', 
      color: 'white', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '50px',
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ color: '#ff8c00', letterSpacing: '2px' }}>HOMERUN DATA</h1>
      <div style={{ width: '100%', maxWidth: '400px', marginTop: '30px' }}>
        {players.map((p, index) => (
          <div key={index} style={{ 
            padding: '20px', 
            borderBottom: '1px solid #1f1f27',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{p.name}</span>
            <span style={{ color: '#ff8c00', fontWeight: 'bold' }}>{p.odds}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
