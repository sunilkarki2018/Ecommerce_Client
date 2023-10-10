import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Typography } from "@mui/material";

import useAppDispatch from "../../app/hooks/useAppDispatch";
import { createProductAsync } from "../../app/redux/reducers/productReducer";
import { fetchAllCategoriesAsync } from "../../app/redux/reducers/categoryReducer";
import useAppSelector from "../../app/hooks/useAppSelector";
import { AppState } from "../../app/redux/store";
import { CreateProductInput } from "../../app/types/Product/CreateProductInput";
import uploadFile from "../../app/functions/UploadFile";

export default function CreateProductForm(): JSX.Element {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>();

  const [images, setImages] = useState<File[]>([]);
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: AppState) => state.user);

  const handleFormSubmit = async (data: CreateProductInput) => {
    let imageLocations: string[] = new Array(images.length);
    for (let i = 0; i < images.length; i++) {
      imageLocations[i] = await uploadFile(images[i]);
    }
    data.images = imageLocations;

    const result = await dispatch(createProductAsync(data));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Product added successfully");
    } else if (result.meta.requestStatus === "rejected") {
      toast.error("Error while adding product");
    }
    navigate("/product");
  };
  const { categories } = useAppSelector((state: AppState) => state.category);

  useEffect(() => {
    dispatch(fetchAllCategoriesAsync());
  }, []);

  if (!currentUser) {
    navigate("/login");
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Add Product
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <Controller
          name="title"
          control={control}
          defaultValue=""
          rules={{ required: "Title is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Title"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
        <Controller
          name="price"
          control={control}
          rules={{
            required: "Price is required",
            pattern: /^\d+(\.\d{1,2})?$/,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Price"
              variant="outlined"
              margin="normal"
              fullWidth
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: "Description is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              variant="outlined"
              margin="normal"
              fullWidth
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select label="Category" {...field} error={!!errors.categoryId}>
                {categories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <InputLabel htmlFor="images">Select Images</InputLabel>
        <Controller
          name="images"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <>
              <input
                type="file"
                multiple
                style={{ margin: "20px 0 0 0", width: "100%" }}
                onChange={handleFileChange}
              />
            </>
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: "20px", width: "20%" }}
        >
          Submit
        </Button>
        <Button
          component={Link}
          to={`/product`}
          size="small"
          variant="contained"
          color="primary"
          style={{ margin: "20px", width: "20%" }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
