import React from "react";
import { AssignedLaneItem } from "../assignLanes";

type Props = {
  item: AssignedLaneItem;
  mouseX: number;
  mouseY: number;
};

export default function Tooltip({ item, mouseX, mouseY }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        left: mouseX + 10,
        top: mouseY - 10,
        background: "#1f2937",
        color: "white",
        padding: "8px 12px",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: "nowrap",
        zIndex: 1000,
        pointerEvents: "none",
        maxWidth: 300,
        wordBreak: "break-word",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {item.name}
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {item.start} → {item.end}
      </div>
    </div>
  );
}
