import { useStore } from "@nanostores/preact";
import { useState } from "preact/hooks";
import { currentStatus } from "../store/currentStatus";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  variant: "login" | "register";
}

const ERRORSTYPES = {
  regex: {
    email: /^[a-z0-9.!#$&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    phone_number: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    username: /^[a-zA-Z\s]{3,}$/,
    image: /image\/(jpg|jpeg|png|webp)/,
  },
  message: {
    email: "Email is invalid",
    phone_number: "Phone number is invalid",
    password:
      "Password must contain at least 8 characters, including 1 letter and 1 number",
    username: "username must contain at least 3 characters and only letters",
    image: "Image must be a valid file type (jpg, jpeg, png, webp)",
  },
};

const LOGINVARIANT = {
  formInput: {
    email: "",
    password: "",
  },
  formError: {
    email: "",
    password: "",
  },
};

const REGISTERVARIANT = {
  formInput: {
    username: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
  },
  formError: {
    username: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
  },
};

const AuthForm = ({ variant }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formInput, setFormInput] = useState<Record<string, string>>(
    variant === "login" ? LOGINVARIANT.formInput : REGISTERVARIANT.formInput
  );
  const [formError, setFormError] = useState<Record<string, string>>(
    variant === "login" ? LOGINVARIANT.formError : REGISTERVARIANT.formError
  );
  const formData = new FormData();
  const $currentStatus = useStore(currentStatus);
  const navigate = useNavigate();

  const fetchApi = async (url: string, data: Record<string, string>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      currentStatus.set({
        active: json.data.active,
        username: json.data.username,
        email: json.data.email,
        phone_number: json.data.phone_number,
        image: json.data.image,
        socketId: json.data.socketId || "",
        id: json.data.id,
        notificationToken: json.data.notificationToken || "",
        room: json.data.room || "",
        admin: json.data.admin || false,
      });
      navigate("/chat");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      setFormInput({ ...formInput, image: json.secure_url });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validate = (key: keyof typeof ERRORSTYPES.regex, value: string) => {
    if (ERRORSTYPES.regex[key].test(value)) {
      setFormError((prevFormError) => ({ ...prevFormError, [key]: "" }));
    } else {
      setFormError((prevFormError) => ({
        ...prevFormError,
        [key]: ERRORSTYPES.message[key],
      }));
    }
  };

  const submit = (e: SubmitEvent) => {
    e.preventDefault();
    const url = variant === "login" ? "login" : "register";

    validate("email", formInput.email);
    validate("password", formInput.password);

    if (variant === "register") {
      validate("username", formInput.username);
      validate("phone_number", formInput.phone_number);
    }

    if (Object.values(formError).every((error) => error === "")) {
      fetchApi(url, formInput);
    }
  };

  return (
    <form onSubmit={submit}>
      {Object.keys(formInput).map((key) => {
        return (
          <div>
            <label for={key}>{key}</label>
            <input
              type={
                key === "password"
                  ? "password"
                  : key === "email"
                  ? "email"
                  : key === "phone_number"
                  ? "tel"
                  : key === "image"
                  ? "file"
                  : "text"
              }
              id={key}
              value={formInput[key]}
              onInput={(e) =>
                key !== "image" &&
                setFormInput({ ...formInput, [key]: e.currentTarget.value })
              }
              onChange={(e) => {
                if (e.currentTarget.files && key === "image") {
                  formData.append("file", e.currentTarget.files[0]);
                  formData.append(
                    "upload_preset",
                    import.meta.env.VITE_CLOUDINARY_PRESET
                  );
                  validate("image", e.currentTarget.files[0].type);

                  if (
                    ERRORSTYPES.regex.image.test(e.currentTarget.files[0].type)
                  ) {
                    if (formData.get("file") && formData.get("upload_preset")) {
                      fetchImage();
                    }
                  }
                }
              }}
            />
            <p>{formError[key]}</p>
          </div>
        );
      })}
      <button type="submit" disabled={isLoading}>
        {variant === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;
