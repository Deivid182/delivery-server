import { server } from './app';
import { PORT } from './config/config';

server.listen(3000, '192.168.0.9' || 'localhost', () => {
  console.log(`Server running on port ${PORT}`);
});