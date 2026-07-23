import { useState } from "react";
import * as XLSX from "xlsx";

export interface ParsedDataset {
  fileName: string;
  sheetName: string;
  rows: number;
  columns: number;
  headers: string[];
  data: Record<string, any>[];
}

export function useExcelParser() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  const [loading, setLoading] = useState(false);

  async function parseExcel(file: File) {
    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: "",
      });

      const headers =
        json.length > 0
          ? Object.keys(json[0])
          : [];

      setDataset({
        fileName: file.name,
        sheetName,
        rows: json.length,
        columns: headers.length,
        headers,
        data: json,
      });

      return {
        fileName: file.name,
        sheetName,
        rows: json.length,
        columns: headers.length,
        headers,
        data: json,
      };
    } finally {
      setLoading(false);
    }
  }

  return {
    dataset,
    loading,
    parseExcel,
  };
}