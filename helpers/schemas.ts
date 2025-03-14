import { object, ref, string } from "yup";

export const LoginSchema = object().shape({
  phone: string()
    .required("This field must be an email")
    .matches(/^\d+$/, "Phone number must be numeric"),
  password: string().required("Password is required"),
});

export const RegisterSchema = object().shape({
  name: string().required("Name is required"),
  email: string()
    .email("This field must be an email")
    .required("Email is required"),
  password: string().required("Password is required"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([ref("password")], "Passwords must match"),
});
