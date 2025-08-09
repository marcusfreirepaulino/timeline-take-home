import React from "react";

type Props = {
  dateColumns: string[];
  columnWidth: number;
  width: number;
  height: number;
  xFor: (date: string) => number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
};

export default React.forwardRef<HTMLDivElement, Props>(function TimelineGrid(
  { dateColumns, columnWidth, width, height, xFor, onScroll, children },
  ref
) {
  return (
    <div
      ref={ref}
      onScroll={onScroll}
      style={{
        position: "relative",
        overflowX: "auto",
        overflowY: "hidden",
        height,
      }}
    >
      <div style={{ position: "relative", width }}>
        {dateColumns.map((date, index) => (
          <div
            key={`content-column-${date}`}
            style={{
              position: "absolute",
              left: xFor(date),
              top: 0,
              width: columnWidth,
              height: "100%",
              boxSizing: "border-box",
              borderRight: "1px solid #f1f5f9",
              background: index % 2 === 0 ? "transparent" : "#fafbfc",
            }}
          />
        ))}
        {children}
      </div>
    </div>
  );
});
