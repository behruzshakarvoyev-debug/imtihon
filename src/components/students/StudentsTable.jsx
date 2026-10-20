import { Pencil, Trash2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import { calcDebt } from "../../utils/debt";
import { formatMoney, formatPhone } from "../../utils/format";

function DebtCell({ student, payments }) {
  if (student.status !== "active") return <span className="text-gray-400">—</span>;

  const debt = calcDebt(student, student.group, payments);
  if (debt > 0) {
    return <span className="font-medium text-red-600">{formatMoney(debt)}</span>;
  }
  return <span className="text-green-600">To'langan</span>;
}

function StudentsTable({ students, payments, onRowClick, onEdit, onDelete }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>F.I.Sh</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Guruh</TableHead>
          <TableHead>Holat</TableHead>
          <TableHead>Qarz</TableHead>
          <TableHead className="text-right">Amallar</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.map((s) => (
          <TableRow key={s.id} className="cursor-pointer" onClick={() => onRowClick(s.id)}>
            <TableCell className="font-medium">
              {s.lastName} {s.firstName}
            </TableCell>
            <TableCell>{formatPhone(s.phone)}</TableCell>
            <TableCell>{s.group?.name}</TableCell>
            <TableCell>
              <StatusBadge status={s.status} />
            </TableCell>
            <TableCell>
              <DebtCell student={s} payments={payments} />
            </TableCell>
            <TableCell className="text-right">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(s);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(s);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default StudentsTable;