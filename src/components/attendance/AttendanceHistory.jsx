import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "../common/EmptyState";
import { formatDate } from "../../utils/format";

function AttendanceHistory({ history = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Oxirgi 10 ta davomat tarixi</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-gray-100 dark:divide-gray-800">
        {history.length === 0 ? (
          <EmptyState text="Hozircha davomat tarixi mavjud emas" />
        ) : (
          history.map((h) => {
            const total = h.records?.length || 0;
            const c = h.records?.filter((r) => r.present).length || 0;
            const percent = total ? Math.round((c / total) * 100) : 0;
            return (
              <div key={h.id} className="flex items-center justify-between py-2 text-sm">
                <span className="font-medium">{formatDate(h.date)}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {percent}% ({c}/{total} talaba)
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default AttendanceHistory;
