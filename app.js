const express = require("express");
const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errors");
require("dotenv").config();
const connectToDB = require("./config/db");

//connection to Database
connectToDB();

//init App
const app = express();

//Apply Middleware
app.use(express.json());
app.use(logger);

//Routers
app.use("/api/books", require("./routers/books"));
app.use("/api/authors", require("./routers/authors"));
app.use('/api/auth', require("./routers/auth"));
app.use("/api/users", require("./routers/users"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is runing in ${process.env.NODE_ENV} on port ${PORT}`));
