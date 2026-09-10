import React, { useEffect, useId, useRef } from "react";
import "./VustCheckbox.css";

export interface VustCheckboxProps extends Omit<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  "onChange" | "id" | "aria-label" | "aria-labelledby" | "aria-describedby"
> {
  /** 绑定值 */
  checked: boolean;
  /** 禁用状态 */
  disabled?: boolean;
  /** 改变事件 */
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  id?: string;
  name?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export const VustCheckbox: React.FC<VustCheckboxProps> = ({
  checked,
  disabled = false,
  onChange,
  indeterminate = false,
  id,
  name,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  className = "",
  children,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const resolvedId = id ?? generatedId;
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange?.(e.target.checked);
  };

  return (
    <label
      htmlFor={resolvedId}
      className={`vl-checkbox ${checked ? "is-active" : ""} ${
        indeterminate ? "is-indeterminate" : ""
      } ${disabled ? "is-disabled" : ""} ${className}`.trim()}
      {...rest}
    >
      <span className="vl-checkbox-input">
        <input
          ref={inputRef}
          id={resolvedId}
          name={name}
          type="checkbox"
          className="vl-checkbox-original"
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-describedby={ariaDescribedby}
          onChange={handleChange}
          aria-checked={indeterminate ? "mixed" : checked}
        />
        <span className="vl-checkbox-inner" />
      </span>
      {children && <span className="vl-checkbox-label">{children}</span>}
    </label>
  );
};
