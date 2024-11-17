import type { FlowComponent } from "solid-js";

import classes from "./oauth-button.module.css";

export interface OauthButtonProps {}

export const OauthButton: FlowComponent = ({ children }) => (
  <button class={classes.button}>{children}</button>
);
