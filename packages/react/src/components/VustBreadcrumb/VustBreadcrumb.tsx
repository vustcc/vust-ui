import React, { createContext } from "react";
import "./VustBreadcrumb.css";

export const BreadcrumbContext = createContext<string>("/");

export interface VustBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 分隔符 */
  separator?: string;
}

export const VustBreadcrumb: React.FC<VustBreadcrumbProps> = ({
  separator = "/",
  className = "",
  children,
  ...rest
}) => {
  return (
    <BreadcrumbContext.Provider value={separator}>
      <nav
        className={`vl-breadcrumb ${className}`.trim()}
        aria-label="Breadcrumb"
        {...rest}
      >
        {children}
      </nav>
    </BreadcrumbContext.Provider>
  );
};
