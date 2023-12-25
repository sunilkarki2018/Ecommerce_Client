import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UpdateUserInput } from "../../types/User/UpdateUserInput";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { AppState } from "../../redux/store";
import { fetchUserAsync, updateUserAsync } from "../../redux/reducers/userReducer";
import { User } from "../../types/User/User";
import AccessDenied from "../errors/AccessDenied";
import uploadFile from "../../utils/uploadFile";



export default function EditProductForm(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams();
  const [images, setImages] = useState<File[]>([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserInput>();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state: AppState) => state.user);

  useEffect(() => {
    dispatch(fetchUserAsync(id!)).then((userData) => {
      const item = userData.payload as User;
      setValue("update.name", item.firstName);
      setValue("update.email", item.email);
      setValue("update.role", item.role);
      setValue("update.avatar", item.avatar.data);
      setValue("id", item.id);
    });
  }, [dispatch, id, setValue]);

  if (currentUser && currentUser?.role.includes("customer")) {
    return <AccessDenied />;
  }
  if (!currentUser) {
    navigate("/login");
  }

  const handleFormSubmit = async (data: UpdateUserInput) => {
    if (images.length > 0) {
      data.update.avatar = await uploadFile(images[0]);
    }
    const result = await dispatch(updateUserAsync(data));
    if (result.meta.requestStatus === "fulfilled") {
      toast.success("User updated successfully");
    } else if (result.meta.requestStatus === "rejected") {
      toast.error("Error while updating User");
    }
    navigate("/users");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  let roles = [
    { id: "customer", name: "customer" },
    { id: "admin", name: "admin" },
  ];

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <Controller
        name="update.name"
        control={control}
        defaultValue=""
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            variant="outlined"
            fullWidth
            error={!!errors.update?.name}
            helperText={errors.update?.name?.message}
          />
        )}
      />
      <Controller
        name="update.email"
        control={control}
        rules={{ required: "Email is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            fullWidth
            error={!!errors.update?.email}
            helperText={errors.update?.email?.message}
          />
        )}
      />
      <Controller
        name="update.password"
        control={control}
        defaultValue=""
        rules={{ required: "Password is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Password"
            variant="outlined"
            fullWidth
            error={!!errors.update?.password}
            helperText={errors.update?.password?.message}
          />
        )}
      />
      <Controller
        name="update.role"
        control={control}
        rules={{ required: "Role is required" }}
        render={({ field }) => (
          <FormControl fullWidth variant="outlined">
            <InputLabel>Role</InputLabel>
            <Select
              label="Category"
              {...field}
              error={!!errors.update?.role}
              value={field.value || ""}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />

      <InputLabel htmlFor="update.avatar">Select Image</InputLabel>
      <Controller
        name="update.avatar"
        control={control}
        render={({ field }) => (
          <input type="file" multiple onChange={handleFileChange} />
        )}
      />

      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
}
