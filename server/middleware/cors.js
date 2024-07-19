// server/middleware/cors.js
import cors from 'cors';

const corsOptions = {
  origin: 'https://easy-rate-links.vercel.app/', // Replace with your frontend domain or use '*' to allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    cors(corsOptions)(event.node.req, event.node.res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
});
