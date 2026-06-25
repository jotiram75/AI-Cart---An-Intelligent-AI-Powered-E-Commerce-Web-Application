import express from "express";
import { submitContactForm, getAllContacts } from "../controller/contactController.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContactForm);
contactRouter.get("/all", getAllContacts);

export default contactRouter;
