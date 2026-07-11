import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import promoRouter from "./routes/promoRoute.js";
import adminRouter from "./routes/adminRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";
import customerRouter from "./routes/customerRoute.js";
import advisorRouter from "./routes/advisorRoute.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { morganMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { securityHeaders, sanitizeInput } from "./middleware/security.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 4000;

app.use(securityHeaders);
app.use(express.json());
app.use(cors());
app.use(sanitizeInput);
app.use(morganMiddleware);
app.use("/api/", apiLimiter);

connectDB();

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Admin panel connected:", socket.id);
  socket.on("disconnect", () =>
    console.log("Admin panel disconnected:", socket.id)
  );
});

app.use("/api/product", productRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/promo", promoRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/customers", customerRouter);
app.use("/api/advisor", advisorRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});

export { io };
