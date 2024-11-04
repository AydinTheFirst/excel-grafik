import {
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

const randomHexColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export const Chart = ({ data }: { data: Data[] }) => {
  if (data.length === 0) {
    return null;
  }

  const lines = Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <ResponsiveContainer height="100%" width="100%">
      <LineChart
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
        {lines.map((line) => (
          <Line
            dataKey={line}
            key={line}
            stroke={randomHexColor()}
            type="monotone"
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
