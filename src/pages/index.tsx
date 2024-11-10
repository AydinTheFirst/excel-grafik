import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Buffer } from "buffer";
import excel from "exceljs";
import { useState } from "react";
import { toast } from "sonner";

import { Chart } from "./_chart";

interface Data {
  [key: string]: number | string;
  name: string;
}

const Home = () => {
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<Data[]>();
  const [type, setType] = useState<"bar" | "line">("bar");

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);

    if (!file) {
      toast.error("Lütfen bir dosya seçin.");
      return;
    }

    const workbook = new excel.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1)!;

    setTitle(worksheet.name);

    const columns = worksheet.getColumn(1).values.filter(Boolean);
    const values = worksheet.columns
      .slice(1)
      .map((column) => column.values!.filter(Boolean));

    const data: Data[] = columns.map((name, i) => {
      const obj: Data = { name: name as string };
      values.forEach((column, j) => {
        obj[`value${j + 1}`] = column[i] as number;
      });
      return obj;
    });

    setData(data);
    toast.success("Excel dosyası başarıyla yüklendi.");
  };

  const clear = () => {
    setTitle("");
    setData(undefined);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(data));
    toast.success("Veri kopyalandı.");
  };

  return (
    <div className="container my-10 grid max-w-xl gap-5">
      {data && (
        <Card className="h-96">
          <CardHeader>
            <h4 className="text-lg font-semibold">{title}</h4>
          </CardHeader>
          <CardBody>
            <Chart data={data} type={type} />
          </CardBody>
        </Card>
      )}
      <div>
        <Card>
          {data ? (
            <>
              <CardHeader>
                <h4 className="text-lg font-semibold">{title}</h4>
              </CardHeader>
              <CardBody className="flex justify-end gap-3">
                <Select
                  defaultSelectedKeys={["bar"]}
                  label="Grafik Türü"
                  name="type"
                  onChange={(e) => setType(e.target.value as "bar" | "line")}
                  value="bar"
                >
                  <SelectItem key={"bar"} value="bar">
                    Bar
                  </SelectItem>
                  <SelectItem key={"line"} value="line">
                    Line
                  </SelectItem>
                </Select>
                <Button color="danger" onClick={clear}>
                  <strong>Temizle</strong>
                </Button>
                <Button color="success" onClick={copy}>
                  <strong>Kopyala</strong>
                </Button>
              </CardBody>
            </>
          ) : (
            <CardBody>
              <Input
                accept=".xlsx"
                isRequired
                label="Excel Dosyası"
                name="file"
                onChange={handleSubmit}
                type="file"
              />
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Home;
