import React from "react";
import "./VustTag.css";

export interface VustTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 标签类型 */
  type?: "primary" | "success" | "warning" | "danger" | "info" | "default";
  /** 主题风格 */
  effect?: "light" | "plain" | "dark";
}

export const VustTag: React.FC<VustTagProps> = ({
  type = "default",
  effect = "light",
  className = "",
  children,
  ...rest
}) => {
  return (
    <span
      className={`vl-tag vl-tag--${type} vl-tag--${effect} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
};
