import React from "react";
import { Grid } from "@mui/material";
import { Product } from "../../types/Product/Product";
import { ProductLine } from "../../types/ProductLine/ProductLine";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export const ProductCardList = ({ products }: Props) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid
          key={product.id}
          item
          xs={4}
          style={{ width: "300px", height: "300px" }}
        >
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};
