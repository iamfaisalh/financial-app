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
import { useNavigate } from "react-router-dom";
import { login } from "../redux/reducers/user";

interface FormErrors {
  email?: boolean;
  password?: boolean;
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

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
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
      };
      if (!isEmailValid(body.email)) formErrors.email = true;
      if (!body.password) formErrors.password = true;
      if (Object.keys(formErrors).length > 0) setErrors(formErrors);
      else {
        setErrors({});
        setAlert(defaultBannerAlertState);
        const response = await api.post("/auth/login", body);
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
          Log in to your account
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
                {/* <div className="flex items-center justify-between">
                  <Label>Password</Label>
                  <div className="text-sm">
                    <Link
                      to={"/signup"}
                      className="font-semibold text-green-600 hover:text-green-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div> */}
                <Label>Password</Label>
                <Input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  invalid={errors.password}
                />
                {errors.password && (
                  <ErrorMessage>Password is required.</ErrorMessage>
                )}
              </Field>
              <Button type="submit" color="green" className="w-full">
                Log in
              </Button>
            </FieldGroup>
          </Fieldset>
        </form>
        <Text className="mt-4 inline-block text-center">
          Don't have an account yet?{" "}
          <Link
            to={"/signup"}
            className="font-semibold leading-6 text-green-600 hover:text-green-500"
          >
            Sign up
          </Link>
        </Text>
      </div>
    </Content>
  );
}
