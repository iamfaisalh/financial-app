import { useState } from "react";
import Brand from "../components/Brand";
import Content from "../components/Content";
import {
  ErrorMessage,
  Field,
  FieldGroup,
  Fieldset,
  Label,
} from "../components/Fieldset";
import { Input } from "../components/Input";
import { Text } from "../components/Text";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import api from "../api";
import BannerAlert from "../components/BannerAlert";
import { isEmailValid } from "../util/functions";
import { useAppDispatch } from "../redux/store";
import { login } from "../redux/reducers/user";
import { useNavigate } from "react-router-dom";

interface FormErrors {
  email?: boolean;
  password?: boolean;
  first_name?: boolean;
  last_name?: boolean;
}

interface BannerAlertObject {
  message: string;
  variant: "Success" | "Error" | "Warning" | "Info" | "Neutral";
  isOpen: boolean;
}

const defaultBannerAlertState: BannerAlertObject = {
  message: "",
  variant: "Neutral",
  isOpen: false,
};

export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [alert, setAlert] = useState<BannerAlertObject>(
    defaultBannerAlertState
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisabled(true);
    try {
      const formErrors: FormErrors = {};
      const body = {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      };
      if (!isEmailValid(body.email)) formErrors.email = true;
      if (!body.first_name) formErrors.first_name = true;
      if (!body.last_name) formErrors.last_name = true;
      if (!body.password) formErrors.password = true;
      if (Object.keys(formErrors).length > 0) setErrors(formErrors);
      else {
        setErrors({});
        setAlert(defaultBannerAlertState);
        const response = await api.post("/auth/signup", body);
        dispatch(login(response.data));
        navigate("/portfolio");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      setAlert({
        message,
        variant: "Error",
        isOpen: true,
      });
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Content className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Link to="/">
          <Brand className="mx-auto text-2xl" />
        </Link>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Create your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {alert.isOpen && (
          <BannerAlert
            className=" mb-4"
            variant={alert.variant}
            message={alert.message}
            onClose={() => setAlert((prev) => ({ ...prev, isOpen: false }))}
            isClosable
          />
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Fieldset disabled={disabled}>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
                <Field>
                  <Label>First name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    invalid={errors.first_name}
                  />
                  {errors.first_name && (
                    <ErrorMessage>First name is required.</ErrorMessage>
                  )}
                </Field>
                <Field>
                  <Label>Last name</Label>
                  <Input
                    type="text"
                    autoComplete="family-name"
                    name="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    invalid={errors.last_name}
                  />
                  {errors.last_name && (
                    <ErrorMessage>Last name is required.</ErrorMessage>
                  )}
                </Field>
              </div>
              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  invalid={errors.email}
                />
                {errors.email && <ErrorMessage>Invalid email.</ErrorMessage>}
              </Field>
              <Field>
                <Label>Password</Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  invalid={errors.password}
                />
                {errors.password && (
                  <ErrorMessage>Password is required.</ErrorMessage>
                )}
              </Field>
              <Button type="submit" color="green" className="w-full">
                Sign up
              </Button>
            </FieldGroup>
          </Fieldset>
        </form>
        <Text className="mt-10 text-center">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-semibold leading-6 text-green-600 hover:text-green-500"
          >
            Log in
          </Link>
        </Text>
      </div>
    </Content>
  );
}
