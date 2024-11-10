import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
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
            <Chart data={data} />
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
          )}
        </Card>
      </div>
    </div>
  );
};

export default Home;
