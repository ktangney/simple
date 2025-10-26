import { useState } from 'react'
import './App.css'
import { useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import GameHistory from './components/GameHistory'
import PlayerStats from './components/PlayerStats'

function App() {
  const { user, loading, logout } = useAuth();
  // State to store players and their scores
  const [players, setPlayers] = useState([])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [activeTab, setActiveTab] = useState('game') // 'game', 'history', 'stats'
  const [saveMessage, setSaveMessage] = useState(null)

  // Add a new player
  const addPlayer = () => {
    if (newPlayerName.trim() === '') return

    const newPlayer = {
      id: Date.now(), // Simple unique ID
      name: newPlayerName,
      scores: Array(9).fill(0) // 9 rounds (holes) in Golf card game
    }

    setPlayers([...players, newPlayer])
    setNewPlayerName('')
  }

  // Update a player's score for a specific round
  const updateScore = (playerId, round, score) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        const newScores = [...player.scores]
        newScores[round] = parseInt(score) || 0
        return { ...player, scores: newScores }
      }
      return player
    }))
  }

  // Calculate total score for a player
  const calculateTotal = (scores) => {
    return scores.reduce((sum, score) => sum + score, 0)
  }

  // Find the winner (lowest score)
  const getWinner = () => {
    if (players.length === 0) return null

    return players.reduce((winner, player) => {
      const playerTotal = calculateTotal(player.scores)
      const winnerTotal = calculateTotal(winner.scores)
      return playerTotal < winnerTotal ? player : winner
    })
  }

  // Remove a player
  const removePlayer = (playerId) => {
    setPlayers(players.filter(player => player.id !== playerId))
  }

  // Save game to database
  const saveGame = async () => {
    if (players.length === 0) {
      alert('No players to save!')
      return
    }

    try {
      const gameData = {
        date: new Date().toISOString(),
        players: players.map(player => ({
          name: player.name,
          scores: player.scores,
          totalScore: calculateTotal(player.scores)
        }))
      }

      const response = await fetch('http://localhost:3001/api/games', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      })

      if (!response.ok) {
        throw new Error('Failed to save game')
      }

      const result = await response.json()
      setSaveMessage({ type: 'success', text: `Game #${result.gameId} saved successfully!` })

      // Clear the message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', text: `Error: ${error.message}` })
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Start a new game
  const newGame = () => {
    if (players.length > 0 && players.some(p => p.scores.some(s => s > 0))) {
      if (!confirm('Start a new game? Current scores will be lost if not saved.')) {
        return
      }
    }
    setPlayers([])
    setSaveMessage(null)
  }

  const winner = getWinner()

  // Show loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user) {
    return <Login />
  }

  return (
    <div className="app">
      {/* User Header */}
      <div className="user-header">
        <div className="user-info">
          {user.picture && <img src={user.picture} alt={user.name} className="user-avatar" />}
          <span className="user-name">{user.name}</span>
        </div>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <h1>Golf Card Game - Score Tracker</h1>
      <p className="subtitle">In Golf, the lowest score wins!</p>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Current Game
        </button>
        <button
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Game History
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Player Stats
        </button>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`save-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'game' && (
        <div className="game-tab">
          {/* Game Actions */}
          {players.length > 0 && (
            <div className="game-actions">
              <button onClick={saveGame} className="save-game-btn">
                Save Game
              </button>
              <button onClick={newGame} className="new-game-btn">
                New Game
              </button>
            </div>
          )}

          {/* Add Player Section */}
          <div className="add-player">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Enter player name"
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button onClick={addPlayer}>Add Player</button>
          </div>

          {/* Score Table */}
          {players.length > 0 && (
            <div className="score-table-container">
              <table className="score-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(round => (
                      <th key={round}>R{round}</th>
                    ))}
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => {
                    const total = calculateTotal(player.scores)
                    const isWinner = winner && player.id === winner.id

                    return (
                      <tr key={player.id} className={isWinner ? 'winner-row' : ''}>
                        <td className="player-name">
                          {player.name}
                          {isWinner && <span className="crown"> 👑</span>}
                        </td>
                        {player.scores.map((score, index) => (
                          <td key={index}>
                            <input
                              type="number"
                              value={score}
                              onChange={(e) => updateScore(player.id, index, e.target.value)}
                              className="score-input"
                              min="0"
                            />
                          </td>
                        ))}
                        <td className="total-score">{total}</td>
                        <td>
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="remove-btn"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {players.length === 0 && (
            <div className="empty-state">
              <p>No players yet. Add your first player to get started!</p>
            </div>
          )}

          {/* Winner Announcement */}
          {winner && players.length > 1 && (
            <div className="winner-announcement">
              <h2>Current Leader: {winner.name} with {calculateTotal(winner.scores)} points!</h2>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && <GameHistory />}
      {activeTab === 'stats' && <PlayerStats />}
    </div>
  )
}

export default App
