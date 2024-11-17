import type { JSX } from "solid-js/jsx-runtime";
import classes from "./button.module.css";
import type { Component } from "solid-js";

export interface ButtonProps {
  primary?: boolean;
  children?: JSX.Element;
}

export const Button: Component<ButtonProps> = ({ primary, children }) => (
  <button classList={{ [classes.button]: true, [classes.primary]: primary }}>
    {children}
  </button>
);
