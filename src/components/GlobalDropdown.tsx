import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  description?: string;
  icon?: React.ElementType | React.ReactNode;
  badge?: string;
  badgeColor?: string;
  selected?: boolean;
  disabled?: boolean;
  danger?: boolean;
  href?: string;
  onClick?: () => void;
  divider?: boolean;
  customContent?: React.ReactNode;
}

export interface DropdownGroup {
  title?: string;
  items: DropdownItem[];
}

export interface TriggerConfig {
  label?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ElementType | React.ReactNode;
  avatarText?: string;
  badge?: string;
  variant?: 'default' | 'primary' | 'red' | 'gold' | 'dark' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showChevron?: boolean;
}

export interface GlobalDropdownProps {
  trigger?: React.ReactNode | TriggerConfig;
  items?: DropdownItem[];
  groups?: DropdownGroup[];
  value?: string;
  onChange?: (id: string, item: DropdownItem) => void;
  align?: 'left' | 'right' | 'center';
  width?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  panelClassName?: string;
  disabled?: boolean;
  closeOnSelect?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  customPanel?: React.ReactNode;
}

const renderIconHelper = (icon: React.ElementType | React.ReactNode, className: string = "w-4 h-4") => {
  if (!icon) return null;
  if (React.isValidElement(icon)) return icon;
  const Component = icon as React.ElementType;
  return <Component className={className} />;
};

export function GlobalDropdown({
  trigger,
  items,
  groups,
  value,
  onChange,
  align = 'left',
  width = 'w-60',
  searchable = false,
  searchPlaceholder = 'Search...',
  header,
  footer,
  className = '',
  panelClassName = '',
  disabled = false,
  closeOnSelect = true,
  isOpen: controlledIsOpen,
  onOpenChange,
  customPanel
}: GlobalDropdownProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(open);
    }
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open) {
      setSearchQuery('');
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Combine items & groups into standardized groups list
  const allGroups: DropdownGroup[] = [];
  if (items && items.length > 0) {
    allGroups.push({ items });
  }
  if (groups && groups.length > 0) {
    allGroups.push(...groups);
  }

  // Filter items based on search query
  const filteredGroups = allGroups.map(group => {
    if (!searchQuery.trim()) return group;
    const q = searchQuery.toLowerCase();
    const filtered = group.items.filter(item => {
      if (typeof item.label === 'string') {
        if (item.label.toLowerCase().includes(q)) return true;
      }
      if (item.description && item.description.toLowerCase().includes(q)) return true;
      if (item.id && item.id.toLowerCase().includes(q)) return true;
      return false;
    });
    return { ...group, items: filtered };
  }).filter(group => group.items.length > 0);

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    }
    if (onChange) {
      onChange(item.id, item);
    }
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  // Alignment classes
  const alignmentClass = 
    align === 'right' ? 'right-0 origin-top-right' :
    align === 'center' ? 'left-1/2 -translate-x-1/2 origin-top' :
    'left-0 origin-top-left';

  // Trigger button styling generator
  const renderTriggerButton = () => {
    if (React.isValidElement(trigger)) {
      return (
        <div 
          onClick={() => !disabled && setIsOpen(!isOpen)} 
          className={`cursor-pointer inline-flex items-center ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        >
          {trigger}
        </div>
      );
    }

    const config = (trigger || {}) as TriggerConfig;
    const {
      label,
      subtitle,
      icon: Icon,
      avatarText,
      badge,
      variant = 'default',
      size = 'md',
      className: configClassName = '',
      showChevron = true
    } = config;

    // Variant style presets
    const variantStyles = {
      default: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 shadow-sm focus:ring-2 focus:ring-[#D31C2B]/30',
      primary: 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm border border-transparent',
      red: 'bg-[#E31C3A] hover:bg-[#c91832] text-white shadow-sm border border-red-700/30',
      gold: 'bg-[#FFD700] hover:bg-[#E6C200] text-gray-950 shadow-sm border border-amber-300 font-extrabold',
      dark: 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-700/60 shadow-md',
      outline: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 border-none',
      glass: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20'
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-3.5 py-2 text-xs font-bold rounded-xl gap-2',
      lg: 'px-4 py-2.5 text-sm font-bold rounded-xl gap-2.5'
    };

    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between transition-all duration-200 select-none active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${configClassName} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          {avatarText && (
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#D31C2B] to-[#B91623] text-white flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm">
              {avatarText}
            </div>
          )}

          {Icon && (
            <span className="shrink-0">
              {renderIconHelper(Icon, "w-4 h-4")}
            </span>
          )}

          <div className="flex flex-col text-left truncate">
            {label && <span className="truncate leading-tight font-extrabold">{label}</span>}
            {subtitle && <span className="text-[10px] opacity-75 leading-none mt-0.5 truncate font-normal">{subtitle}</span>}
          </div>

          {badge && (
            <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider bg-red-100 text-[#E31C3A]">
              {badge}
            </span>
          )}
        </div>

        {showChevron && (
          <ChevronDown className={`w-3.5 h-3.5 shrink-0 opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {renderTriggerButton()}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute top-full mt-2 z-50 ${alignmentClass} ${width} bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden ${panelClassName}`}
          >
            {/* Optional Header */}
            {header && (
              <div className="p-3 border-b border-gray-100 bg-gray-50/80">
                {header}
              </div>
            )}

            {/* Optional Search Bar */}
            {searchable && (
              <div className="p-2 border-b border-gray-100 relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 text-xs font-medium rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E31C3A]/40 focus:bg-white"
                />
              </div>
            )}

            {/* Custom Panel Content option */}
            {customPanel ? (
              <div className="p-2">{customPanel}</div>
            ) : (
              /* Dropdown Items List */
              <div className="max-h-72 overflow-y-auto p-1.5 space-y-1">
                {filteredGroups.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs font-semibold text-gray-400">
                    No matching options
                  </div>
                ) : (
                  filteredGroups.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-0.5">
                      {group.title && (
                        <div className="px-3 py-1 text-[9px] font-black uppercase tracking-wider text-gray-400">
                          {group.title}
                        </div>
                      )}

                      {group.items.map((item) => {
                        const isItemSelected = item.selected || (value !== undefined && item.id === value);
                        const ItemIcon = item.icon;

                        const content = (
                          <div
                            onClick={() => handleItemClick(item)}
                            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                              item.disabled
                                ? 'opacity-40 cursor-not-allowed'
                                : item.danger
                                ? 'text-red-600 hover:bg-red-50'
                                : isItemSelected
                                ? 'bg-red-50/80 text-[#E31C3A]'
                                : 'text-gray-800 hover:bg-gray-100/80'
                            }`}
                          >
                            {item.customContent ? (
                              item.customContent
                            ) : (
                              <div className="flex items-center gap-2.5 min-w-0">
                                {ItemIcon && (
                                  <span className={`shrink-0 ${isItemSelected ? 'text-[#E31C3A]' : 'text-gray-500'}`}>
                                    {renderIconHelper(ItemIcon, "w-4 h-4")}
                                  </span>
                                )}

                                <div className="flex flex-col text-left truncate">
                                  <span className="truncate font-bold leading-tight">{item.label}</span>
                                  {item.description && (
                                    <span className="text-[10px] text-gray-400 font-normal truncate mt-0.5">
                                      {item.description}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              {item.badge && (
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${item.badgeColor || 'bg-amber-100 text-amber-800'}`}>
                                  {item.badge}
                                </span>
                              )}
                              {isItemSelected && (
                                <Check className="w-3.5 h-3.5 text-[#E31C3A] font-bold" />
                              )}
                            </div>
                          </div>
                        );

                        return (
                          <React.Fragment key={item.id}>
                            {item.href ? (
                              <Link to={item.href} className="block w-full" onClick={() => closeOnSelect && setIsOpen(false)}>
                                {content}
                              </Link>
                            ) : (
                              content
                            )}
                            {item.divider && <div className="my-1 border-b border-gray-100" />}
                          </React.Fragment>
                        );
                      })}
                      {gIdx < filteredGroups.length - 1 && <div className="my-1 border-b border-gray-100" />}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Optional Footer */}
            {footer && (
              <div className="p-2 border-t border-gray-100 bg-gray-50/80 text-xs">
                {footer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GlobalDropdown;
