"use client";
import React from 'react';

// 1. DATA (Truncated for build safety, you can expand this later)
const players = [
  { id: 1, name: "Yordan Alvarez", team: "HOU", odds: "+270", grade: "A+" },
  { id: 2, name: "Ozzie Albies", team: "ATL", odds: "+570", grade: "A" },
  { id: 3, name: "Aaron Judge", team: "NYY", odds: "+310", grade: "S" }
];

// 2. THE PAGE
export default function Page() {
  return (
    <main style={{ 
      background: '#0a0a0f', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '40px 20px', 
      fontFamily: 'sans-serif' 
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', letterSpacing: '2px', margin: 0 }}>
          HOMERUN <span style={{ color: '#ff8c00' }}>DATA</span>
        </h1>
        <p style={{ color: '#555', fontSize: '12px', marginTop: '8px' }}>LIVE PROJECTIONS • 2026</p>
      </header>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {players.map((p) => (
          <div key={p.id} style={{ 
            background: '#16161e', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid #2d2d3d', 
            marginBottom: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontWeight: 'bold', display: 'block' }}>{p.name}</span>
              <span style={{ color: '#555', fontSize: '12px' }}>{p.team}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#ff8c00', fontWeight: 'bold' }}>{p.odds}</div>
              <div style={{ color: '#4caf50', fontSize: '12px' }}>{p.grade}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
