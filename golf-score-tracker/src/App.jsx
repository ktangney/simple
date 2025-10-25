import { useState } from 'react'
import './App.css'

function App() {
  // State to store players and their scores
  const [players, setPlayers] = useState([])
  const [newPlayerName, setNewPlayerName] = useState('')
  const [currentRound, setCurrentRound] = useState(1)

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

  const winner = getWinner()

  return (
    <div className="app">
      <h1>Golf Card Game - Score Tracker</h1>
      <p className="subtitle">In Golf, the lowest score wins!</p>

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
  )
}

export default App
