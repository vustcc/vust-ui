import React, { useMemo } from "react";
import { getIcon } from "@vustcc/icons";
import type { IconNamespace } from "@vustcc/icons";
import "./VustIcon.css";

export interface VustIconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string | null;
  namespace?: IconNamespace;
  size?: number | string;
  label?: string;
  decorative?: boolean;
}

export const VustIcon: React.FC<VustIconProps> = ({
  name = "fallback",
  namespace = "common",
  size = 24,
  label = "",
  decorative = true,
  className = "",
  style,
  ...rest
}) => {
  const iconName = useMemo(() => {
    const normalized = (name ?? "").trim().toLowerCase();
    return /^[a-z0-9-]+$/.test(normalized) ? normalized : "fallback";
  }, [name]);

  const iconSource = useMemo(() => {
    return getIcon(iconName, namespace);
  }, [iconName, namespace]);

  const iconSize = useMemo(() => {
    return typeof size === "number" ? `${size}px` : size;
  }, [size]);

  const combinedStyle = {
    "--vl-icon-size": iconSize,
    ...style,
  } as React.CSSProperties;

  return (
    <span
      className={`vl-icon ${className}`.trim()}
      style={combinedStyle}
      aria-hidden={decorative ? "true" : undefined}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : label || iconName}
      dangerouslySetInnerHTML={{ __html: iconSource }}
      {...rest}
    />
  );
};
