import express from "express";
import { createContactMessage } from "../controllers/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/contact", createContactMessage);

export default contactRouter;

