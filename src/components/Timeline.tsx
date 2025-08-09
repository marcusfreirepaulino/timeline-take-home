import React, { useMemo, useState, useRef, useCallback } from "react";
import { assignLanes, AssignedLaneItem } from "../assignLanes";
import { TimelineItem } from "../timelineItems";
import TimelineItemComponent from "./TimelineItem";
import Tooltip from "./Tooltip";
import DateAxis from "./DateAxis";
import TimelineGrid from "./TimelineGrid";

type Props = {
  items: TimelineItem[];
};

function parseDate(value: string): number {
  return new Date(value + "T00:00:00Z").getTime();
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseDate(b) - parseDate(a)) / msPerDay);
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00Z");
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric" 
  });
}

function getExtent(items: TimelineItem[]): { start: string; end: string } {
  let min = items[0]?.start ?? "2021-01-01";
  let max = items[0]?.end ?? "2021-12-31";
  for (const it of items) {
    if (it.start < min) min = it.start;
    if (it.end > max) max = it.end;
  }
  return { start: min, end: max };
}

export default function Timeline({ items }: Props) {
  const [hoveredItem, setHoveredItem] = useState<AssignedLaneItem | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(items);
  const axisRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const extent = useMemo(() => getExtent(timelineItems), [timelineItems]);
  const assigned = useMemo<AssignedLaneItem[]>(
    () => assignLanes(timelineItems),
    [timelineItems]
  );

  const numDays = daysBetween(extent.start, extent.end) + 1;
  const columnWidth = 60;
  const width = numDays * columnWidth;
  const laneHeight = 36;
  const laneGap = 6;
  const axisHeight = 40;

  function getDateColumns(): string[] {
    const columns: string[] = [];
    for (let i = 0; i < numDays; i++) {
      columns.push(addDays(extent.start, i));
    }
    return columns;
  }

  function xFor(date: string): number {
    const dayIndex = daysBetween(extent.start, date);
    return dayIndex * columnWidth;
  }

  function wFor(start: string, end: string): number {
    const startIndex = daysBetween(extent.start, start);
    const endIndex = daysBetween(extent.start, end);
    return (endIndex - startIndex + 1) * columnWidth;
  }

  const dateColumns = useMemo(() => getDateColumns(), [extent.start, numDays]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    if (axisRef.current && contentRef.current) {
      if (e.currentTarget === axisRef.current) {
        contentRef.current.scrollLeft = scrollLeft;
      } else {
        axisRef.current.scrollLeft = scrollLeft;
      }
    }
  }, []);

  const handleItemHover = useCallback((item: AssignedLaneItem, mouseX: number, mouseY: number) => {
    setHoveredItem(item);
    setMousePosition({ x: mouseX, y: mouseY });
  }, []);

  const handleItemHoverEnd = useCallback(() => {
    setHoveredItem(null);
  }, []);

  const handleItemEdit = useCallback((item: AssignedLaneItem, newName: string) => {
    setTimelineItems(prev => 
      prev.map(timelineItem => 
        timelineItem.id === item.id 
          ? { ...timelineItem, name: newName }
          : timelineItem
      )
    );
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <DateAxis
          ref={axisRef}
          dateColumns={dateColumns}
          columnWidth={columnWidth}
          axisHeight={axisHeight}
          width={width}
          formatDateLabel={formatDateLabel}
          xFor={xFor}
          onScroll={handleScroll}
        />
        
        <TimelineGrid
          ref={contentRef}
          dateColumns={dateColumns}
          columnWidth={columnWidth}
          width={width}
          height={
            assigned.reduce((m, it) => Math.max(m, it.laneIndex), 0) *
              (laneHeight + laneGap) +
            laneHeight +
            16
          }
          xFor={xFor}
          onScroll={handleScroll}
        >
          {assigned.map((item) => (
            <TimelineItemComponent
              key={item.id}
              item={item}
              left={xFor(item.start)}
              top={item.laneIndex * (laneHeight + laneGap) + 8}
              width={wFor(item.start, item.end)}
              height={laneHeight}
              onEdit={handleItemEdit}
              onHover={handleItemHover}
              onHoverEnd={handleItemHoverEnd}
            />
          ))}
        </TimelineGrid>
      </div>
      <div style={{ marginTop: 8, color: "#64748b" }}>
        Range {extent.start} → {extent.end}
      </div>

      <div style={{ marginTop: 8, color: "#64748b" }}>
        Tip: You can edit the timeline items by double clicking on them.
      </div>
      
      {hoveredItem && (
        <Tooltip
          item={hoveredItem}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
        />
      )}
    </div>
  );
}
