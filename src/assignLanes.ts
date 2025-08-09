import { TimelineItem } from "./timelineItems"

export type AssignedLaneItem = TimelineItem & { laneIndex: number }

export function assignLanes(items: TimelineItem[]): AssignedLaneItem[] {
  const itemsCopy = [...items]
  itemsCopy.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

  const lanes: TimelineItem[][] = []
  const assigned: AssignedLaneItem[] = []

  for (const item of itemsCopy) {
    let placed = false
    for (let i = 0; i < lanes.length; i++) {
      const lane = lanes[i]
      const last = lane[lane.length - 1]
      if (new Date(last.end) < new Date(item.start)) {
        lane.push(item)
        assigned.push({ ...item, laneIndex: i })
        placed = true
        break
      }
    }
    if (!placed) {
      lanes.push([item])
      assigned.push({ ...item, laneIndex: lanes.length - 1 })
    }
  }
  return assigned
}


