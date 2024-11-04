import { Button, Card, CardBody, Input } from "@nextui-org/react";
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
  const [data, setData] = useState<Data[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    if (!file) {
      toast.error("Lütfen bir dosya seçin.");
      return;
    }

    const workbook = new excel.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1)!;

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

  return (
    <div className="container my-10">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardBody>
              <form className="grid gap-3" onSubmit={handleSubmit}>
                <Input
                  accept=".xlsx"
                  isRequired
                  label="Excel Dosyası"
                  name="file"
                  type="file"
                />
                <Button color="primary" type="submit">
                  Tabloya Aktar
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
        <div className="col-span-12 md:col-span-8">
          <Chart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Home;
