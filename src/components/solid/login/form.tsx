import { Button } from "../button/button";
import { Input } from "../input/input";

export const LogingForm = () => {
  return (
    <form action="/auth/login" method="post">
      <Input label="Email:" type="email" autocomplete="username" />
      <Input
        label="Password:"
        type="password"
        autocomplete="current-password"
      />
      <Button primary>Login</Button>
      <Button>Login</Button>
    </form>
  );
};
