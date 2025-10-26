import { useState, useEffect } from 'react'

function GameHistory() {
  const [games, setGames] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/games', {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch games')
      const data = await response.json()
      setGames(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchGameDetails = async (gameId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/games/${gameId}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch game details')
      const data = await response.json()
      setSelectedGame(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteGame = async (gameId) => {
    if (!confirm('Are you sure you want to delete this game?')) return

    try {
      const response = await fetch(`http://localhost:3001/api/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to delete game')

      // Refresh the games list
      fetchGames()
      if (selectedGame?.id === gameId) {
        setSelectedGame(null)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  if (loading) {
    return <div className="loading">Loading game history...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchGames}>Retry</button>
      </div>
    )
  }

  return (
    <div className="game-history">
      <h2>Game History</h2>

      {games.length === 0 ? (
        <div className="empty-state">
          <p>No games recorded yet. Complete and save a game to see it here!</p>
        </div>
      ) : (
        <div className="history-layout">
          {/* Games List */}
          <div className="games-list">
            <h3>Recent Games ({games.length})</h3>
            {games.map((game) => (
              <div
                key={game.id}
                className={`game-card ${selectedGame?.id === game.id ? 'active' : ''}`}
                onClick={() => fetchGameDetails(game.id)}
              >
                <div className="game-card-header">
                  <strong>Game #{game.id}</strong>
                  <span className="game-date">{formatDate(game.created_at)}</span>
                </div>
                <div className="game-card-details">
                  <span>{game.player_count} players</span>
                  <span className="winner-info">
                    Winner: {game.winner_name} ({game.winning_score} pts)
                  </span>
                </div>
                <button
                  className="delete-game-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteGame(game.id)
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Game Details */}
          {selectedGame && (
            <div className="game-details">
              <h3>Game #{selectedGame.id} Details</h3>
              <p className="game-details-date">{formatDate(selectedGame.created_at)}</p>

              <div className="score-table-container">
                <table className="score-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(round => (
                        <th key={round}>R{round}</th>
                      ))}
                      <th>Total</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGame.participants.map((participant) => (
                      <tr key={participant.id} className={participant.won ? 'winner-row' : ''}>
                        <td className="player-name">
                          {participant.player_name}
                          {participant.won === 1 && <span className="crown"> 👑</span>}
                        </td>
                        <td>{participant.round_1}</td>
                        <td>{participant.round_2}</td>
                        <td>{participant.round_3}</td>
                        <td>{participant.round_4}</td>
                        <td>{participant.round_5}</td>
                        <td>{participant.round_6}</td>
                        <td>{participant.round_7}</td>
                        <td>{participant.round_8}</td>
                        <td>{participant.round_9}</td>
                        <td className="total-score">{participant.total_score}</td>
                        <td>
                          {participant.won === 1 ? (
                            <span className="won-badge">Won</span>
                          ) : (
                            <span className="lost-badge">Lost</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GameHistory
