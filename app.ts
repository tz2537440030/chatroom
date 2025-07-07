import express from "express";
import * as bodyParser from "body-parser";
import router from "@/routes/index";
import errorMiddleware from "@/models/err-middle-ware";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/apis", router);

const PORT = process.env.PORT || 3000;
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
