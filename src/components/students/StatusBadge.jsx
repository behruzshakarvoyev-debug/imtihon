import { Badge } from "@/components/ui/badge";

const statuses = {
  active: { text: "Faol", className: "bg-green-100 text-green-700" },
  frozen: { text: "Muzlatilgan", className: "bg-blue-100 text-blue-700" },
  left: { text: "Ketgan", className: "bg-gray-200 text-gray-700" },
};

function StatusBadge({ status }) {
  const item = statuses[status] || statuses.left;
  return <Badge className={item.className}>{item.text}</Badge>;
}

export default StatusBadge;