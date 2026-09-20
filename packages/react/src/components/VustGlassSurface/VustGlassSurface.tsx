import React from "react";
import type { VustGlassProfile, VustGlassValue } from "../../glass";
import { useGlass } from "../../internal/use-glass";

export interface VustGlassSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  /** 根元素类型，默认 div。 */
  as?: React.ElementType;
  /** 公共材质预设。 */
  profile?: VustGlassProfile;
  /** 局部材质配置；省略时继承 Provider。 */
  glass?: VustGlassValue;
}

/** 无业务间距与布局的公共 Liquid Glass 表面。 */
export const VustGlassSurface: React.FC<VustGlassSurfaceProps> = ({
  as: Component = "div",
  profile = "surface",
  glass,
  className = "",
  children,
  ...rest
}) => {
  const glassRef = useGlass<HTMLElement>(glass, profile);
  return (
    <Component
      ref={glassRef}
      className={`vl-glass-surface ${className}`.trim()}
      data-glass-profile={profile}
      {...rest}
    >
      {children}
    </Component>
  );
};
