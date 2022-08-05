const express = require("express");
const app = express();
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(logger("tiny"));
app.use(logger("dev"));

//Routes
// const categoriesRoutes = require("./routes/categories");
// const productsRoutes = require("./routes/products");
// const usersRoutes = require("./routes/users");
// const ordersRoutes = require("./routes/orders");

// const api = process.env.API_URL;

// app.use(`${api}/categories`, categoriesRoutes);
// app.use(`${api}/products`, productsRoutes);
// app.use(`${api}/users`, usersRoutes);
// app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//error catcher
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//respond to client
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  res.status(status).json({
    message: err.message,
    error: error,
  });

  console.log("error", err);
  next();
});

//Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
