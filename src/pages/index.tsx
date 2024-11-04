import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { Buffer } from "buffer";
import excel from "exceljs";
import { useState } from "react";
import { toast } from "sonner";

const Home = () => {
  const [data, setData] = useState<unknown>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const file = data.get("file") as File;

    if (!file) {
      toast.error("Lütfen bir dosya seçin.");
      return;
    }

    const workbook = new excel.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1)!;

    const rows = worksheet.getSheetValues();
    setData(rows);

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
          {JSON.stringify(data, null, 2)}
        </div>
      </div>
    </div>
  );
};

export default Home;
