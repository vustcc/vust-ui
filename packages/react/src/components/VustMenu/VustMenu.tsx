import React, { useRef } from "react";
import "./VustMenu.css";

export interface MenuItem {
  key: string;
  label: string;
}

export interface MenuCategory {
  key: string;
  label: string;
  children: MenuItem[];
}

export interface VustMenuProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange" | "onSelect"
> {
  /** 当前选中的菜单项 key */
  value: string;
  /** 菜单项列表 (带分组) */
  items: MenuCategory[];
  /** 绑定值改变事件 */
  onChange?: (key: string) => void;
}

export const VustMenu: React.FC<VustMenuProps> = ({
  value,
  items = [],
  onChange,
  className = "",
  ...rest
}) => {
  const menuRef = useRef<HTMLElement>(null);
  const handleSelect = (key: string) => {
    onChange?.(key);
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const buttons = [
      ...(menuRef.current?.querySelectorAll<HTMLButtonElement>(
        ".vl-menu-item-button",
      ) ?? []),
    ];
    const current = buttons.indexOf(
      document.activeElement as HTMLButtonElement,
    );
    const index =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? buttons.length - 1
          : (current + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
            buttons.length;
    event.preventDefault();
    buttons[index]?.focus();
  };

  return (
    <nav
      ref={menuRef}
      className={`vl-menu ${className}`.trim()}
      aria-label="Menu"
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {items.map((category) => (
        <div key={category.key} className="vl-menu-group">
          <div className="vl-menu-group-title">{category.label}</div>
          <ul className="vl-menu-items">
            {category.children.map((item) => (
              <li
                key={item.key}
                className={`vl-menu-item ${value === item.key ? "is-active" : ""}`.trim()}
              >
                <button
                  type="button"
                  className="vl-menu-item-button"
                  aria-current={value === item.key ? "page" : undefined}
                  onClick={() => handleSelect(item.key)}
                >
                  <span className="vl-menu-item-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};
