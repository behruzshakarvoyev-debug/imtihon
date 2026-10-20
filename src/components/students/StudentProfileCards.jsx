import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { formatDate, formatMoney, formatPhone } from "../../utils/format";
import { calcAge } from "../../utils/studentUtils";

function StudentProfileCards({ student, payments, debt, attInfo }) {
  const sorted = [...payments].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
  const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="text-base">Talaba ma'lumotlari</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-gray-500">Telefon:</span> <span className="font-medium">{formatPhone(student.phone)}</span></p>
          <p><span className="text-gray-500">Tug'ilgan sana:</span> {formatDate(student.birthDate)} ({calcAge(student.birthDate)} yosh)</p>
          <div className="flex items-center gap-2"><span className="text-gray-500">Holat:</span> <StatusBadge status={student.status} /></div>
          <p><span className="text-gray-500">Qo'shilgan sana:</span> {formatDate(student.joinedAt)}</p>
          <p><span className="text-gray-500">Izoh:</span> {student.note || "—"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Guruh ma'lumotlari</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {student.group ? (
            <>
              <p>
                <span className="text-gray-500">Guruh:</span>{" "}
                <Link className="font-semibold text-blue-600 hover:underline dark:text-blue-400" to={`/dashboard/groups/${student.group.id}`}>
                  {student.group.name} ({student.group.course})
                </Link>
              </p>
              <p><span className="text-gray-500">O'qituvchi:</span> <span className="font-medium">{student.group.teacher}</span></p>
              <p><span className="text-gray-500">Kun va vaqt:</span> {student.group.days === "toq" ? "Toq kunlar" : "Juft kunlar"}, {student.group.time}</p>
              <p><span className="text-gray-500">Oylik to'lov:</span> {formatMoney(student.group.monthlyPrice)}</p>
            </>
          ) : (
            <p className="text-gray-500">Guruh biriktirilmagan</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">To'lov va davomat hisobi</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><span className="text-gray-500">Jami to'langan summa:</span> <span className="font-semibold">{formatMoney(totalPaid)}</span></p>
          <p>
            <span className="text-gray-500">Joriy oy qarzi:</span>{" "}
            <span className={debt > 0 ? "font-bold text-red-600" : "font-semibold text-emerald-600"}>
              {debt > 0 ? formatMoney(debt) : "Qarz yo'q (To'langan)"}
            </span>
          </p>
          <p>
            <span className="text-gray-500">Davomat ko'rsatkichi:</span>{" "}
            <span className="font-semibold">{attInfo ? `${attInfo.percent}% (${attInfo.ratio})` : "Ma'lumot yo'q"}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">To'lovlar tarixi ({sorted.length})</CardTitle></CardHeader>
        <CardContent className="max-h-60 overflow-y-auto space-y-2 text-sm">
          {sorted.length === 0 ? (
            <p className="text-gray-500">Hozircha to'lovlar yo'q</p>
          ) : (
            sorted.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b pb-1 dark:border-gray-800">
                <div>
                  <span className="font-medium capitalize">{p.method}</span>
                  <span className="text-xs text-gray-500 ml-2">({formatDate(p.paidAt)})</span>
                </div>
                <span className="font-semibold text-emerald-600">+{formatMoney(p.amount)}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentProfileCards;
