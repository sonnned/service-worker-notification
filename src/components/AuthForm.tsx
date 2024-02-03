import { useState } from "preact/hooks";

interface AuthFormProps {
  variant: "login" | "register";
}

const ERRORSTYPES = {
  regex: {
    email: /^[a-z0-9.!#$&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    phone_number: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
    name: /^[a-zA-Z\s]{3,}$/,
    image: /(\.jpg|\.jpeg|\.png|\.webp)$/i,
  },
  message: {
    email: "Email is invalid",
    phone_number: "Phone number is invalid",
    password:
      "Password must contain at least 8 characters, including 1 letter and 1 number",
    name: "Name must contain at least 3 characters and only letters",
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
    name: "",
    email: "",
    password: "",
    phone_number: "",
    image: "",
  },
  formError: {
    name: "",
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

  console.log(formInput);

  const fetchApi = async (url: string, data: Record<string, string>) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      console.log(json);
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
    const url = variant === "login" ? "/login" : "/register";

    validate("email", formInput.email);
    validate("password", formInput.password);

    if (variant === "register") {
      validate("name", formInput.name);
      validate("phone_number", formInput.phone_number);
      validate("image", formInput.image);
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
                  : "text"
              }
              id={key}
              value={formInput[key]}
              onInput={(e) =>
                setFormInput({ ...formInput, [key]: e.currentTarget.value })
              }
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
