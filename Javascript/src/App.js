import "./App.css";
import "antd/dist/antd.css";

import CovidGraph from "./components/charts/covidgraph";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CovidGraph />
      </header>
    </div>
  );
}

export default App;
