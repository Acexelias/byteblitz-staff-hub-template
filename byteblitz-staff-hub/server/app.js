require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const leadsRoutes = require('./routes/leads');
const resourcesRoutes = require('./routes/resources');
const bookingsRoutes = require('./routes/bookings');
const supportRoutes = require('./routes/support');
const adminRoutes = require('./routes/admin');

const authenticate = require('./middleware/auth');

const app = express();

// Enable CORS for all origins during development.  In production,
// restrict origins as needed.
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/leads', authenticate, leadsRoutes);
app.use('/api/resources', authenticate, resourcesRoutes);
app.use('/api/bookings', authenticate, bookingsRoutes);
app.use('/api/support', authenticate, supportRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.json({ message: 'ByteBlitz Staff Hub API' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});