import { Pencil, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "../../utils/format";

function GroupCard({ group, studentsCount, onOpen, onEdit, onDelete }) {
  const active = group.status === "active";

  return (
    <Card className="cursor-pointer transition hover:shadow-md" onClick={() => onOpen(group.id)}>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{group.name}</CardTitle>
          <p className="text-sm text-gray-500">{group.course}</p>
        </div>
        <Badge className={active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}>
          {active ? "Faol" : "Tugagan"}
        </Badge>
      </CardHeader>

      <CardContent className="grid gap-2 text-sm">
        <p>O'qituvchi: <span className="font-medium">{group.teacher}</span></p>
        <p>{group.days === "toq" ? "Toq kunlar" : "Juft kunlar"}, {group.time}</p>
        <p>Narx: <span className="font-medium">{formatMoney(group.monthlyPrice)}</span></p>
        <p className="flex items-center gap-1">
          <Users className="h-4 w-4" /> {studentsCount} ta talaba
        </p>

        <div className="mt-2 flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onEdit(group); }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onDelete(group); }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GroupCard;