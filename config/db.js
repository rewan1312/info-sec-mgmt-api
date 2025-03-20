const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error('❌ MONGO_URI is not defined in .env file');
    process.exit(1);
}

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        setTimeout(() => process.exit(1), 5000);
    }
};

// التعامل مع أخطاء الاتصال بقاعدة البيانات
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err);
    setTimeout(() => process.exit(1), 5000);
});

module.exports = connectDB;
