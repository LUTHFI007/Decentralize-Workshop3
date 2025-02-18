const express = require('express');
const connectDB = require("./db");
const cors = require("cors");

const PORT = 3003;

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

connectDB();
const app = express();
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Register routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/cart", cartRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at: http://localhost:${3003}`);
});
