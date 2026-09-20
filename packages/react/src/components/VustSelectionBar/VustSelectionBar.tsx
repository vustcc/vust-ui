import React from "react";
import { VustButton } from "../VustButton/VustButton";
import type { VustGlassValue } from "../../glass";
import { useGlass } from "../../internal/use-glass";
import "./VustSelectionBar.css";

export interface VustSelectionBarProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "aria-label"
> {
  /** 已选择项目数量。 */
  count: number;
  /** 数量前的本地化说明，例如“已选择”。 */
  label: string;
  /** 清除选择按钮文案；不传时隐藏按钮。 */
  clearLabel?: string;
  /** 是否禁止清除选择。 */
  clearDisabled?: boolean;
  /** 选择摘要的无障碍名称。 */
  ariaLabel?: string;
  /** 清除选择回调。 */
  onClear?: () => void;
  /** 批量操作。 */
  children?: React.ReactNode;
  /** 液态玻璃材质配置 */
  glass?: VustGlassValue;
}

export const VustSelectionBar: React.FC<VustSelectionBarProps> = ({
  count,
  label,
  clearLabel,
  clearDisabled = false,
  ariaLabel,
  onClear,
  children,
  glass,
  className = "",
  ...rest
}) => {
  const glassRef = useGlass<HTMLDivElement>(glass, "control");
  return (
    <div
      ref={glassRef}
      className={`vl-selection-bar ${className}`.trim()}
      {...rest}
      data-ui="selection-bar"
    >
      <div
        className="vl-selection-summary"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={ariaLabel}
        data-slot="selection-summary"
      >
        <span className="vl-selection-label">{label}</span>
        <span className="vl-selection-count">{count}</span>
      </div>
      <div className="vl-selection-actions" data-slot="selection-actions">
        {children}
        {clearLabel && (
          <VustButton
            glass={glass}
            disabled={clearDisabled}
            data-ui="clear-selection"
            onClick={onClear}
          >
            {clearLabel}
          </VustButton>
        )}
      </div>
    </div>
  );
};
