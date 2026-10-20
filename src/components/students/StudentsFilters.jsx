import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

function StudentsFilters({ searchInput, onSearch, groupId, onGroup, status, onStatus, groups }) {
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      <Input
        placeholder="Ism, familiya yoki telefon..."
        value={searchInput}
        onChange={(e) => onSearch(e.target.value)}
      />
      <Select value={groupId} onValueChange={onGroup}>
        <SelectTrigger><SelectValue placeholder="Guruh" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha guruhlar</SelectItem>
          {groups.map((g) => (
            <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger><SelectValue placeholder="Holat" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Barcha holatlar</SelectItem>
          <SelectItem value="active">Faol</SelectItem>
          <SelectItem value="frozen">Muzlatilgan</SelectItem>
          <SelectItem value="left">Ketgan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default StudentsFilters;