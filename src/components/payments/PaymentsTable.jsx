import { Trash2 } from "lucide-react";
import { formatMoney, formatDate } from "../../utils/format";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

function PaymentsTable({ visible, students, onDelete }) {
  const studentOf = (id) => students.find((s) => Number(s.id) === Number(id));
  const total = visible.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Talaba</TableHead>
            <TableHead>Guruh</TableHead>
            <TableHead>Summa</TableHead>
            <TableHead>Oy</TableHead>
            <TableHead>Usul</TableHead>
            <TableHead>Sana</TableHead>
            <TableHead className="text-right">Amal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((p) => {
            const s = studentOf(p.studentId);
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {s ? `${s.lastName} ${s.firstName}` : "—"}
                </TableCell>
                <TableCell>{s?.group?.name || "—"}</TableCell>
                <TableCell className="font-semibold text-emerald-600">
                  {formatMoney(p.amount)}
                </TableCell>
                <TableCell>{p.month}</TableCell>
                <TableCell className="capitalize">{p.method}</TableCell>
                <TableCell>{formatDate(p.paidAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(p)}
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t p-4 text-sm font-semibold dark:border-gray-800">
        <span className="text-gray-500">Jami to'lovlar soni: {visible.length} ta</span>
        <span className="text-base text-emerald-600">Jami summa: {formatMoney(total)}</span>
      </div>
    </>
  );
}

export default PaymentsTable;
