import express from "express";
import isAuth from "../middleware/isAuth.js";
import { addProductReview, listProductReviews } from "../controller/reviewController.js";

const reviewRoutes = express.Router();

reviewRoutes.get("/:productId", listProductReviews);
reviewRoutes.post("/:productId", isAuth, addProductReview);

export default reviewRoutes;

