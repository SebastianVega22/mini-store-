require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectMongo } = require('./config/db');
const { PORT, CORS_ORIGIN } = require('./config/env');
const productsRouter = require('./routes/products.routes');
const ordersRouter = require('./routes/orders.routes');
const errorHandler = require('./middlewares/error-handler');

const app = express();
app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);

app.use(errorHandler);

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
});
