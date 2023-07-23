const express = require('express');
const bodyParser = require('body-parser');
const { specs, swaggerUi } = require('./swagger');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const mongoose = require('mongoose');

// Middleware
app.use(bodyParser.json());
// mongo db
mongoose.connect('mongodb://127.0.0.1:27017/fmcg-commercial-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
