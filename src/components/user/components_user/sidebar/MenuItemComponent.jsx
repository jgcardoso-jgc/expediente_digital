/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-confusing-arrow */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable react/require-default-props */
/* eslint-disable quotes */
import React from "react";
// eslint-disable-next-line object-curly-newline
import { any, arrayOf, func, string } from "prop-types";
import { Column, Row } from "simple-flexbox";
import { createUseStyles, useTheme } from "react-jss";
import { useSidebar } from "../../hooks/useSidebar";
import CollapsibleContent from "../collapsible/CollapsibleContent";

const useStyles = createUseStyles({
  activeContainer: {
    backgroundColor: () => "rgba(221, 226, 255, 0.08)",
  },
  container: {
    display: "flex",
    height: 56,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: () => "rgba(221, 226, 255, 0.08)",
    },
    paddingLeft: ({ level }) => 32 * level,
    transition: "all 0.2s ease-in-out",
  },
  leftBar: {
    borderLeft: ({ level }) => (level > 1 ? "none" : "3px solid #8b8d94"),
  },
  title: {
    fontSize: 16,
    lineHeight: "20px",
    letterSpacing: "0.2px",
    color: (isActive) => (isActive ? "#DDE2FF" : "#A4A6B3"),
    marginLeft: 24,
  },
});

function MenuItemComponent({
  children,
  icon: Icon,
  id,
  items = [],
  level = 1,
  onClick,
  title,
}) {
  const theme = useTheme();
  const isCollapsible = children && children.length > 0;
  const { isExpanded, isActive, onItemClick } = useSidebar({
    isCollapsible,
    item: id,
    items,
  });
  const classes = useStyles({ theme, level, isActive });
  const classNameColumn = isActive ? classes.leftBar : "";
  const classNameContainer = [
    classes.container,
    isActive && classes.activeContainer,
  ].join(" ");
  const iconColor = isActive ? "#DDE2FF" : "#9fa2b4";

  function onItemClicked(e) {
    if (onClick) {
      onClick(e);
    }
    onItemClick();
  }

  return (
    <Column key={id} className={classNameColumn}>
      <Row
        vertical="center"
        onClick={onItemClicked}
        className={classNameContainer}
      >
        <Icon
          fill={iconColor}
          style={{ fontSize: "20px" }}
          opacity={!isActive && "0.4"}
        />
        <span className={classes.title}>{title}</span>
      </Row>
      {isCollapsible && (
        <CollapsibleContent expanded={isExpanded}>
          {children.map((child) => child.type({ ...child.props }))}
        </CollapsibleContent>
      )}
    </Column>
  );
}

MenuItemComponent.defaultProps = {};

MenuItemComponent.propTypes = {
  children: any,
  icon: func,
  id: string,
  onClick: func,
  items: arrayOf(string),
  title: string,
};

export default MenuItemComponent;
