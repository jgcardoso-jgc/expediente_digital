/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children, defaultItem }) {
  const [currentItem, setCurrentItem] = useState(defaultItem);
  useEffect(() => {
    if (defaultItem !== currentItem) {
      return setCurrentItem(defaultItem);
    }
  }, [currentItem, defaultItem]);
  return (
    <SidebarContext.Provider value={{ currentItem, setCurrentItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = ({ isCollapsible, item, subroutes } = {}) => {
  const { currentItem, setCurrentItem } = useContext(SidebarContext);
  //  const isActive = item === currentItem || subroute?.includes(currentItem);
  function checkActive(i) {
    if (i === currentItem) {
      return true;
    }
    if (subroutes) {
      for (let x = 0; x < subroutes.length; x += 1) {
        if (subroutes[x].includes(currentItem)) {
          return true;
        }
      }
    }
    return false;
  }
  const isActive = checkActive(item);
  const [isExpanded, setIsExpanded] = useState(isActive);

  useEffect(() => {
    if (!isActive && isExpanded) {
      return setIsExpanded(false);
    }
    if (isActive && !isExpanded) {
      return setIsExpanded(true);
    }
  }, [currentItem]);

  const onItemClick = () => {
    if (!isCollapsible) {
      setCurrentItem(item);
    }
    setIsExpanded((prev) => !prev);
  };

  console.log(`isactive:${isActive}`);
  return {
    isExpanded,
    isActive,
    onItemClick,
  };
};
