import { useCallback, useState, useEffect } from "react";

function convToJson(csv) {
  var lines = csv.split("\n");

  var result = [];

  var headers = lines[0].split(",").map((item) => item.trim());

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }
  return result;
}

function StatesData(data) {
  this.states = data;
}

StatesData.prototype.getStates = function () {
  return Object.keys(
    this.states.reduce((acc, row) => {
      if (!row.State || acc[row.State]) return acc;
      acc[row.State] = true;
      return acc;
    }, {})
  );
};

StatesData.prototype.getDataForState = function (state, fields) {
  const stateData = this.states.filter((row) => row.State === state);
  const labels = stateData.map((row) => row.Date);
  const datasets = fields.map((field) => ({
    label: field.label,
    data: stateData.map((row) => row[field.field]),
    backgroundColor: field.color,
  }));
  return { labels, datasets };
};

function transformApiResponse(csvData) {
  return new StatesData(
    convToJson(csvData)
      .map((item) =>
        Object.assign({}, item, {
          tpr: item.Tested
            ? ((item.Confirmed * 100) / item.Tested).toFixed(2)
            : 0,
        })
      )
      .sort((a, b) => (a.Date > b.Date ? 1 : -1))
  );
}

export const useFetch = (service) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();

  const fetchAPI = useCallback(async () => {
    try {
      const res = await fetch(service);
      const resStr = await res.text();
      setData(transformApiResponse(resStr));
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }, [service]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  return { data, error, loading };
};
