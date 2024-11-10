import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Data {
  [key: string]: number | string;
  name: string;
}

export const Chart = ({ data }: { data: Data[] }) => {
  console.log(data);

  if (data.length === 0) {
    return null;
  }

  const randomHexColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const lines = Object.keys(data[0]).filter((key) => key !== "name");

  return (
    <ResponsiveContainer width="100%">
      <BarChart
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
          <Bar dataKey={line} fill={randomHexColor()} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
