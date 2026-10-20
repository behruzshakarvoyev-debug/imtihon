import { Button } from "@/components/ui/button";

function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="mt-4 flex items-center justify-between">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Oldingi
      </Button>
      <span className="text-sm text-gray-600">
        {page}-sahifa / {totalPages}
      </span>
      <Button variant="outline" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Keyingi
      </Button>
    </div>
  );
}

export default Pagination;