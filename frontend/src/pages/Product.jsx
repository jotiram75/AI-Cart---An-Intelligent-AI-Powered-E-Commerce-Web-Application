import React from "react";
import LatestCollection from "../component/LatestCollection";
import BestSeller from "../component/BestSeller";

function Product() {
  return (
    <div className="bg-white">
      <LatestCollection />
      <BestSeller />
    </div>
  );
}

export default Product;
