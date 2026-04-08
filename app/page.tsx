"use client";
import React from 'react';

export default function Page() {
  const players = [
    { id: 1, name: "Yordan Alvarez", team: "HOU", odds: "+270" },
    { id: 2, name: "Ozzie Albies", team: "ATL", odds: "+570" },
    { id: 3, name: "Aaron Judge", team: "NYY", odds: "+310" }
  ];

  return (
    <div style={{ 
      backgroundColor: '#0a0a0f', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: 'sans-serif' 
    }}>
      <h1 style={{ textAlign: 'center', color: '#ff8c00' }}>HOMERUN DATA</h1>
      <div style={{ maxWidth: '400px', margin: '20px auto' }}>
        {players.map((p) => (
          <div key={p.id} style={{ 
            padding: '15px', 
            borderBottom: '1px solid #222',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{p.name}</span>
            <span style={{ color: '#ff8c00' }}>{p.odds}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
