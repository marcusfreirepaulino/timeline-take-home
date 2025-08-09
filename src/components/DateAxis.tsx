import React from "react";

type Props = {
  dateColumns: string[];
  columnWidth: number;
  axisHeight: number;
  width: number;
  formatDateLabel: (date: string) => string;
  xFor: (date: string) => number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export default React.forwardRef<HTMLDivElement, Props>(function DateAxis(
  { dateColumns, columnWidth, axisHeight, width, formatDateLabel, xFor, onScroll },
  ref
) {
  return (
    <div
      ref={ref}
      onScroll={onScroll}
      style={{
        height: axisHeight,
        borderBottom: "1px solid #e2e8f0",
        overflowX: "auto",
        overflowY: "hidden",
        background: "#f8fafc",
      }}
    >
      <div style={{ position: "relative", width, height: "100%" }}>
        {dateColumns.map((date, index) => (
          <div key={`axis-column-${date}`}>
            {index % 7 === 0 && (
              <div
                style={{
                  position: "absolute",
                  left: xFor(date),
                  top: 0,
                  width: 1,
                  height: "100%",
                  background: "#e2e8f0",
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: xFor(date),
                top: 0,
                width: columnWidth,
                height: "100%",
                boxSizing: "border-box",
                borderRight: "1px solid #f1f5f9",
              }}
            />
          </div>
        ))}
        {dateColumns.map((date) => (
          <div
            key={`axis-label-${date}`}
            style={{
              position: "absolute",
              left: xFor(date),
              top: 8,
              width: columnWidth,
              fontSize: 10,
              color: "#64748b",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "0 2px",
              boxSizing: "border-box",
            }}
          >
            {formatDateLabel(date)}
          </div>
        ))}
      </div>
    </div>
  );
});
