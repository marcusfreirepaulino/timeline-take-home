import React from "react"
import ReactDOM from "react-dom/client"
import Timeline from "./components/Timeline"
import timelineItems from "./timelineItems"
import "./app.css"

function App() {
  return (
    <div>
      <h2>Airtable Timeline</h2>
      <Timeline items={timelineItems} />
    </div>
  )
}

const rootElement = document.getElementById("root") as HTMLElement
const root = ReactDOM.createRoot(rootElement)
root.render(<App />)


