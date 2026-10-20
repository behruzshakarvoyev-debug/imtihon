import { Button } from "@/components/ui/button";

function ErrorState({ message = "Xato yuz berdi", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-red-600">{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Qayta urinish</Button>}
    </div>
  );
}

export default ErrorState;