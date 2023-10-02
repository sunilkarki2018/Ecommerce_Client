import { LockOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAppDispatch from "../../app/hooks/useAppDispatch";
import { fetchUserProfileAsync, loginAsync } from "../../app/redux/reducers/userReducer";
import { AppState } from "../../app/redux/store";
import useAppSelector from "../../app/hooks/useAppSelector";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm();
  const { isAdmin, loggedIn, access_token } = useAppSelector(
    (state: AppState) => state.user
  );
  const dispatch = useAppDispatch();

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(
        loginAsync({ email: data.username, password: data.password })
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container component={Paper} maxWidth="sm">
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitForm)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          autoFocus
          {...register("username", { required: "Username is required" })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          {...register("password", { required: "Password is required" })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to="/register" style={{ textDecoration: "none" }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
