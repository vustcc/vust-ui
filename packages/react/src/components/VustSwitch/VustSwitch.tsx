import React from "react";
import "./VustSwitch.css";

export interface VustSwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value"
> {
  value: boolean;
  onChange?: (value: boolean) => void;
  activeText?: string;
  disabled?: boolean;
}

export const VustSwitch: React.FC<VustSwitchProps> = ({
  value,
  onChange,
  activeText = "",
  disabled = false,
  className = "",
  ...rest
}) => {
  const toggle = () => {
    if (disabled) return;
    onChange?.(!value);
  };

  return (
    <button
      type="button"
      className={`vl-switch ${value ? "is-active" : ""} ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      onClick={toggle}
      role="switch"
      aria-checked={value}
      disabled={disabled}
      {...rest}
    >
      <div className="vl-switch-track">
        <div className="vl-switch-handle" />
      </div>
      {activeText && <span className="vl-switch-label">{activeText}</span>}
    </button>
  );
};
