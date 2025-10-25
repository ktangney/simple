import { useState, useEffect } from 'react'

function PlayerStats() {
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState('games_won') // games_won, avg_score, win_rate

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3001/api/players/stats')
      if (!response.ok) throw new Error('Failed to fetch player stats')
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sortedStats = [...stats].sort((a, b) => {
    switch (sortBy) {
      case 'games_won':
        return b.games_won - a.games_won
      case 'avg_score':
        return a.avg_score - b.avg_score
      case 'win_rate':
        return b.win_rate - a.win_rate
      case 'games_played':
        return b.games_played - a.games_played
      default:
        return 0
    }
  })

  if (loading) {
    return <div className="loading">Loading player statistics...</div>
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={fetchStats}>Retry</button>
      </div>
    )
  }

  return (
    <div className="player-stats">
      <h2>Player Statistics</h2>

      {stats.length === 0 ? (
        <div className="empty-state">
          <p>No player statistics yet. Complete some games to see player stats!</p>
        </div>
      ) : (
        <>
          <div className="sort-controls">
            <label>Sort by: </label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="games_won">Most Wins</option>
              <option value="win_rate">Win Rate</option>
              <option value="avg_score">Best Avg Score</option>
              <option value="games_played">Most Games</option>
            </select>
          </div>

          <div className="stats-grid">
            {sortedStats.map((player, index) => (
              <div key={player.id} className="stat-card">
                <div className="stat-card-header">
                  <h3>
                    {index === 0 && <span className="rank-badge gold">🥇</span>}
                    {index === 1 && <span className="rank-badge silver">🥈</span>}
                    {index === 2 && <span className="rank-badge bronze">🥉</span>}
                    {player.name}
                  </h3>
                </div>
                <div className="stat-card-body">
                  <div className="stat-row">
                    <span className="stat-label">Games Played:</span>
                    <span className="stat-value">{player.games_played}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Games Won:</span>
                    <span className="stat-value highlight">{player.games_won}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Win Rate:</span>
                    <span className="stat-value">{player.win_rate}%</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Avg Score:</span>
                    <span className="stat-value">{player.avg_score}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Best Score:</span>
                    <span className="stat-value success">{player.best_score}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">Worst Score:</span>
                    <span className="stat-value danger">{player.worst_score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default PlayerStats
