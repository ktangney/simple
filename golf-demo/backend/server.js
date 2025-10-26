import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Get or create a player by name
function getOrCreatePlayer(name) {
  const existing = db.prepare('SELECT id FROM players WHERE name = ?').get(name);
  if (existing) {
    return existing.id;
  }
  const result = db.prepare('INSERT INTO players (name) VALUES (?)').run(name);
  return result.lastInsertRowid;
}

// POST /api/games - Save a completed game
app.post('/api/games', (req, res) => {
  try {
    const { players, date } = req.body;

    if (!players || players.length === 0) {
      return res.status(400).json({ error: 'No players provided' });
    }

    // Start transaction
    const insertGame = db.prepare('INSERT INTO games (date, completed) VALUES (?, 1)');
    const insertParticipant = db.prepare(`
      INSERT INTO game_participants
      (game_id, player_id, total_score, round_1, round_2, round_3, round_4, round_5, round_6, round_7, round_8, round_9, won)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((players, date) => {
      const gameResult = insertGame.run(date || new Date().toISOString());
      const gameId = gameResult.lastInsertRowid;

      // Find winner (lowest score)
      const minScore = Math.min(...players.map(p => p.totalScore));

      // Insert all players
      for (const player of players) {
        const playerId = getOrCreatePlayer(player.name);
        const isWinner = player.totalScore === minScore ? 1 : 0;

        insertParticipant.run(
          gameId,
          playerId,
          player.totalScore,
          player.scores[0] || 0,
          player.scores[1] || 0,
          player.scores[2] || 0,
          player.scores[3] || 0,
          player.scores[4] || 0,
          player.scores[5] || 0,
          player.scores[6] || 0,
          player.scores[7] || 0,
          player.scores[8] || 0,
          isWinner
        );
      }

      return gameId;
    });

    const gameId = transaction(players, date);
    res.json({ success: true, gameId });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

// GET /api/games - Get all games with basic info
app.get('/api/games', (req, res) => {
  try {
    const games = db.prepare(`
      SELECT
        g.id,
        g.date,
        g.created_at,
        COUNT(gp.id) as player_count,
        MIN(gp.total_score) as winning_score,
        (SELECT p.name FROM players p
         JOIN game_participants gp2 ON p.id = gp2.player_id
         WHERE gp2.game_id = g.id AND gp2.won = 1
         LIMIT 1) as winner_name
      FROM games g
      LEFT JOIN game_participants gp ON g.id = gp.game_id
      GROUP BY g.id
      ORDER BY g.created_at DESC
      LIMIT 50
    `).all();

    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// GET /api/games/:id - Get detailed game info
app.get('/api/games/:id', (req, res) => {
  try {
    const { id } = req.params;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const participants = db.prepare(`
      SELECT
        gp.*,
        p.name as player_name
      FROM game_participants gp
      JOIN players p ON gp.player_id = p.id
      WHERE gp.game_id = ?
      ORDER BY gp.total_score ASC
    `).all(id);

    res.json({ ...game, participants });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

// GET /api/players/stats - Get player statistics
app.get('/api/players/stats', (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT
        p.id,
        p.name,
        COUNT(gp.id) as games_played,
        SUM(gp.won) as games_won,
        ROUND(AVG(gp.total_score), 2) as avg_score,
        MIN(gp.total_score) as best_score,
        MAX(gp.total_score) as worst_score,
        ROUND(CAST(SUM(gp.won) AS FLOAT) / COUNT(gp.id) * 100, 1) as win_rate
      FROM players p
      LEFT JOIN game_participants gp ON p.id = gp.player_id
      GROUP BY p.id
      HAVING games_played > 0
      ORDER BY games_won DESC, avg_score ASC
    `).all();

    res.json(stats);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Failed to fetch player stats' });
  }
});

// GET /api/players/:id/history - Get a specific player's game history
app.get('/api/players/:id/history', (req, res) => {
  try {
    const { id } = req.params;

    const history = db.prepare(`
      SELECT
        g.id as game_id,
        g.date,
        gp.total_score,
        gp.won,
        gp.round_1, gp.round_2, gp.round_3, gp.round_4, gp.round_5,
        gp.round_6, gp.round_7, gp.round_8, gp.round_9
      FROM game_participants gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ?
      ORDER BY g.created_at DESC
    `).all(id);

    res.json(history);
  } catch (error) {
    console.error('Error fetching player history:', error);
    res.status(500).json({ error: 'Failed to fetch player history' });
  }
});

// DELETE /api/games/:id - Delete a game
app.delete('/api/games/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM games WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
