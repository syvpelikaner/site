import { LogingForm } from "./form";

import classes from "./styles.module.css";

export const LoginComponent = () => {
  return (
    <div class={classes.container}>
      <div class={classes.loginContainer}>
        <h2>Welcome</h2>
        <LogingForm />
      </div>
    </div>
  );
};
