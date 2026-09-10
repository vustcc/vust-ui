import React, { useContext } from "react";
import { BreadcrumbContext } from "../VustBreadcrumb/VustBreadcrumb";
import "./VustBreadcrumbItem.css";

export interface VustBreadcrumbItemProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 子元素，面包屑项内容 */
  children?: React.ReactNode;
}

export const VustBreadcrumbItem: React.FC<VustBreadcrumbItemProps> = ({
  className = "",
  children,
  ...rest
}) => {
  const separator = useContext(BreadcrumbContext);

  return (
    <span className={`vl-breadcrumb-item ${className}`.trim()} {...rest}>
      <span className="vl-breadcrumb-label">{children}</span>
      <span className="vl-breadcrumb-separator" role="presentation">
        {separator}
      </span>
    </span>
  );
};
