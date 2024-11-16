import express from 'express';
import cors from 'cors';

export class APIServer {
  constructor(botManager) {
    this.app = express();
    this.botManager = botManager;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  setupRoutes() {
    this.app.get('/api/buttons', (req, res) => {
      res.json(this.botManager.getButtonResponses());
    });

    this.app.post('/api/buttons/:id', (req, res) => {
      const { id } = req.params;
      const { response } = req.body;
      
      const success = this.botManager.updateButtonResponse(id, response);
      res.json({ success });
    });
  }

  start(port = 3000) {
    this.app.listen(port, () => {
      console.log(`API server running on port ${port}`);
    });
  }
}