import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mock AI endpoint - replace with actual AI service
app.post('/api/suggest-boundaries', async (req, res) => {
  try {
    const { satelliteImageDataUri, clickedPoint } = req.body;
    
    // Mock response - in production, call your AI service here
    // This returns a simple rectangle around the clicked point
    const mockPolygon = [
      [clickedPoint.x - 50, clickedPoint.y - 30],
      [clickedPoint.x + 50, clickedPoint.y - 30],
      [clickedPoint.x + 50, clickedPoint.y + 30],
      [clickedPoint.x - 50, clickedPoint.y + 30]
    ];

    res.json({
      coordinates: mockPolygon,
      confidence: 0.85
    });
  } catch (error) {
    console.error('AI detection error:', error);
    res.status(500).json({ error: 'AI detection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
