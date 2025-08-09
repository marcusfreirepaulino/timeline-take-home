import React, { useState, useCallback } from "react";
import { AssignedLaneItem } from "../assignLanes";

type Props = {
  item: AssignedLaneItem;
  left: number;
  top: number;
  width: number;
  height: number;
  onEdit: (item: AssignedLaneItem, newName: string) => void;
  onHover: (item: AssignedLaneItem, mouseX: number, mouseY: number) => void;
  onHoverEnd: () => void;
};

export default function TimelineItem({
  item,
  left,
  top,
  width,
  height,
  onEdit,
  onHover,
  onHoverEnd,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(item.name);
    onHoverEnd();
  }, [item.name, onHoverEnd]);

  const handleSaveEdit = useCallback(() => {
    if (editValue.trim()) {
      onEdit(item, editValue.trim());
    }
    setIsEditing(false);
    setEditValue("");
  }, [item, editValue, onEdit]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditValue("");
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  }, [handleSaveEdit, handleCancelEdit]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    if (!isEditing) {
      onHover(item, e.clientX, e.clientY);
    }
  }, [item, isEditing, onHover]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isEditing) {
      onHover(item, e.clientX, e.clientY);
    }
  }, [item, isEditing, onHover]);

  const handleMouseLeave = useCallback(() => {
    if (!isEditing) {
      onHoverEnd();
    }
  }, [isEditing, onHoverEnd]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onDoubleClick={() => !isEditing && handleDoubleClick()}
      style={{
        position: "absolute",
        left: left + 2,
        top,
        width: width - 4,
        height,
        background: isEditing ? "#1e40af" : "#3b82f6",
        color: "white",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        padding: "0 8px",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        cursor: isEditing ? "text" : "pointer",
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveEdit}
          autoFocus
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "inherit",
            fontFamily: "inherit",
            width: "100%",
            outline: "none",
            padding: 0,
          }}
        />
      ) : (
        item.name
      )}
    </div>
  );
}
