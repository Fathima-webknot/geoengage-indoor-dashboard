import React from 'react'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <h1 style={{ color: '#1976d2', marginBottom: '8px' }}>
        🎯 GeoEngage Admin Dashboard
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        Project initialized successfully! Ready for Phase 1 development.
      </p>
      <p style={{ 
        marginTop: '24px', 
        padding: '12px 24px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '8px',
        color: '#1565c0'
      }}>
        ✅ Commit 1: React + Vite + TypeScript Setup Complete
      </p>
    </div>
  )
}

export default App
