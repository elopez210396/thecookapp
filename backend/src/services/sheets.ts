import { google, sheets_v4 } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID!;

let sheetsClient: sheets_v4.Sheets | null = null;

function getClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export async function readSheet(sheetName: string): Promise<Record<string, string>[]> {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  });

  const rows = res.data.values;
  if (!rows || rows.length < 1) return [];

  const [headers, ...body] = rows;
  return body.map((row) => {
    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header] = row[i] ?? '';
    });
    return record;
  });
}

export async function appendRow(sheetName: string, headers: string[], row: Record<string, string>): Promise<void> {
  const sheets = getClient();
  const values = [headers.map((h) => row[h] ?? '')];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}

export async function updateRowById(
  sheetName: string,
  headers: string[],
  id: string,
  updatedRow: Record<string, string>,
): Promise<void> {
  const sheets = getClient();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetName,
  });
  const rows = res.data.values ?? [];
  const idColIndex = rows[0]?.indexOf('id') ?? 0;

  const rowIndex = rows.findIndex((row, i) => i > 0 && row[idColIndex] === id);
  if (rowIndex === -1) {
    throw new Error(`No se encontró la fila con id ${id} en ${sheetName}`);
  }

  const values = [headers.map((h) => updatedRow[h] ?? '')];
  const rowNumber = rowIndex + 1; // 1-indexed sheet row (rowIndex already accounts for the header row)

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A${rowNumber}:${String.fromCharCode(65 + headers.length - 1)}${rowNumber}`,
    valueInputOption: 'RAW',
    requestBody: { values },
  });
}
