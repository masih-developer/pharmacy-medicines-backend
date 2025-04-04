import { object, string } from "yup";

const registerSchema = object({
  firstname: string()
    .min(3, "firstname must be atleast 5 character")
    .max(20, "firstname must be maximum 20 character"),
  lastname: string()
    .min(5, "lastname must be atleast 5 character")
    .max(20, "lastname must be maximum 20 character"),
  username: string()
    .required("Username is required")
    .min(4, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .matches(
      /^[a-z-A-Z]\w+$/,
      "Username can only contain letters, numbers, or underscores",
    )
    .lowercase("Username must be lowercase"),
  email: string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password cannot exceed 20 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/\d/, "Password must contain at least one number"),
});

const loginSchema = object({
  email: registerSchema.fields.email,
  password: registerSchema.fields.password,
});

export { loginSchema, registerSchema };
