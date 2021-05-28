import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Menu, Dropdown, Spin, Empty, Result } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { useFetch } from "../../data";

const statesMenu = (states, selectedState, setState) => (
  <Menu
    selectedKeys={[selectedState]}
    theme="dark"
    onClick={(item) => {
      setState(item.key);
    }}
  >
    {states.map((state) => (
      <Menu.Item key={state}>{state}</Menu.Item>
    ))}
  </Menu>
);

function CovidGraph() {
  const [states, setStates] = useState([]);
  const [state, setState] = useState(null);
  const { data, error, loading } = useFetch(
    "https://api.covid19india.org/csv/latest/states.csv"
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    const states = data.getStates();
    setStates(states);
    setState(states[0]);
  }, [data]);

  if (loading) {
    return <Spin size="large" />;
  }
  if (error) {
    return (
      <Result status="error" title="Couldn't fetch data" subTitle={error} />
    );
  }
  if (!data || !states || !state) {
    return <Empty />;
  }

  const dataAll = data.getDataForState(state, [
    { label: "Confirmed", field: "Confirmed", color: "#E69A8DFF" },
    { label: "Recovered", field: "Recovered", color: "#5F4B8BFF" },
    { label: "Deceased", field: "Deceased", color: "#42EADDFF" },
    { label: "Tested", field: "Tested", color: "#CDB599FF" },
  ]);
  const dataTpr = data.getDataForState(state, [
    { label: "Test Positivity Rate", field: "tpr", color: "#264653" },
  ]);

  return (
    <div>
      <Dropdown
        trigger={["hover", "click"]}
        overlay={statesMenu(states, state, setState)}
        overlayStyle={{ minWidth: 100 }}
        placement="topCenter"
      >
        <div style={{ color: "black" }}>
          {state} <DownOutlined />
        </div>
      </Dropdown>

      <div style={{ display: "flex", width: "1500px" }}>
        <div style={{ width: "700px" }}>
          <Line data={dataAll} width={700} height={600} />
        </div>
        <div style={{ width: "700px" }}>
          <Line data={dataTpr} width={700} height={600} />
        </div>
      </div>
    </div>
  );
}

CovidGraph.propTypes = {};

export default CovidGraph;
