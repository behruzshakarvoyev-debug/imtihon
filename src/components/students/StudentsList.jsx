import LoadingState from "../common/LoadingState";
import ErrorState from "../common/ErrorState";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import StudentsTable from "./StudentsTable";

function StudentsList({
  loading,
  error,
  students,
  payments,
  total,
  page,
  limit,
  onRetry,
  onRowClick,
  onEdit,
  onDelete,
  onPageChange,
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (students.length === 0) return <EmptyState text="Talabalar topilmadi" />;

  return (
    <>
      <StudentsTable
        students={students}
        payments={payments}
        onRowClick={onRowClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onChange={onPageChange}
      />
    </>
  );
}

export default StudentsList;
