import React from "react";
import type { VustGlassValue } from "../../glass";
import { useGlass } from "../../internal/use-glass";
import "./VustSwitch.css";

export interface VustSwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "value"
> {
  value: boolean;
  onChange?: (value: boolean) => void;
  activeText?: string;
  disabled?: boolean;
  glass?: VustGlassValue;
}

export const VustSwitch: React.FC<VustSwitchProps> = ({
  value,
  onChange,
  activeText = "",
  disabled = false,
  glass,
  className = "",
  ...rest
}) => {
  const glassRef = useGlass<HTMLDivElement>(glass, "control");
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
        <div ref={glassRef} className="vl-switch-handle" />
      </div>
      {activeText && <span className="vl-switch-label">{activeText}</span>}
    </button>
  );
};
