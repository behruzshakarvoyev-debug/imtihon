import { Button } from "@/components/ui/button";

function AttendanceList({ students, marks, onToggle }) {
  return (
    <div>
      {students.map((s) => {
        const present = marks[s.id];
        return (
          <div key={s.id} className="flex items-center justify-between border-b py-2 text-sm">
            <span>{s.lastName} {s.firstName}</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={present ? "default" : "outline"}
                onClick={() => onToggle(s.id, true)}
              >
                Keldi
              </Button>
              <Button
                size="sm"
                variant={!present ? "destructive" : "outline"}
                onClick={() => onToggle(s.id, false)}
              >
                Kelmadi
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AttendanceList;