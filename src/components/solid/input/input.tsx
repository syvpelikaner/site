import classes from "./input.module.css";

export interface InputProps {
  type: string;
  autocomplete: string;
  label: string;
}

export const Input = ({ type, autocomplete, label }: InputProps) => {
  return (
    <label class={classes.label}>
      {label}
      <input class={classes.input} type={type} autocomplete={autocomplete} />
    </label>
  );
};
