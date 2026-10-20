import { Card, CardContent } from "@/components/ui/card";

const variants = {
  default: "bg-blue-100 text-blue-600",
  success: "bg-green-100 text-green-600",
  warning: "bg-yellow-100 text-yellow-600",
  danger: "bg-red-100 text-red-600",
};

function StatCard({ title, value, icon: Icon, variant = "default" }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-6">
        <div className={`rounded-lg p-3 ${variants[variant]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;