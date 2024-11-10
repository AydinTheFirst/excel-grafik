import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Data {
  [key: string]: number | string;
  name: string;
}

interface ChartProps {
  data: Data[];
  type: "bar" | "line";
}

export const Chart = ({ data, type }: ChartProps) => {
  console.log(data);

  if (data.length === 0) {
    return null;
  }

  const randomHexColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const lines = Object.keys(data[0]).filter((key) => key !== "name");

  const ChartComponent = type === "bar" ? BarChart : LineChart;
  const renderLines = (dataKey: string) => {
    if (type === "bar") {
      return <Bar dataKey={dataKey} fill={randomHexColor()} />;
    }

    return <Line dataKey={dataKey} stroke={randomHexColor()} type="monotone" />;
  };

  return (
    <ResponsiveContainer width="100%">
      <ChartComponent
        data={data}
        height={300}
        margin={{
          bottom: 5,
          left: 20,
          right: 30,
          top: 5,
        }}
        width={500}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => renderLines(line))}
      </ChartComponent>
    </ResponsiveContainer>
  );
};
