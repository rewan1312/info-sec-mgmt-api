const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/products'); 
const userRoutes = require('./routes/users'); 

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // ✅ تمكين CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ Database connection failed:', err));

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err);
});

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
