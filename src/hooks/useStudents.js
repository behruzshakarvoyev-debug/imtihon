import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getStudents } from "../api/students";
import { getGroups } from "../api/groups";
import { getPayments } from "../api/payments";
import { currentMonth } from "../utils/debt";

export const LIMIT = 10;

export function useStudents() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("q") || "";
  const urlGroup = searchParams.get("groupId") || "all";
  const urlStatus = searchParams.get("status") || "all";
  const urlPage = parseInt(searchParams.get("page") || "1", 10) || 1;

  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [groups, setGroups] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    async function loadExtra() {
      try {
        const [g, p] = await Promise.all([
          getGroups(),
          getPayments({ month: currentMonth() }),
        ]);
        setGroups(g.data);
        setPayments(p.data);
      } catch {
        setError("Guruh ma'lumotlarini yuklab bo'lmadi");
      }
    }
    loadExtra();
  }, [attempt]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== urlSearch) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) next.set("q", searchInput.trim());
          else next.delete("q");
          next.set("page", "1");
          return next;
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, setSearchParams]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = { _expand: "group", _page: urlPage, _limit: LIMIT };
        if (urlSearch) params.q = urlSearch;
        if (urlGroup !== "all") params.groupId = urlGroup;
        if (urlStatus !== "all") params.status = urlStatus;

        const res = await getStudents(params);
        if (cancelled) return;
        setStudents(res.data);
        const count = res.headers["x-total-count"];
        setTotal(count !== undefined ? Number(count) : res.data.length);
      } catch {
        if (!cancelled) setError("Talabalarni yuklab bo'lmadi");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [urlSearch, urlGroup, urlStatus, urlPage, attempt]);

  const updateFilter = (key, val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val === "all" || !val) next.delete(key);
      else next.set(key, val);
      next.set("page", "1");
      return next;
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const reload = () => setAttempt((a) => a + 1);

  return {
    students, total, groups, payments, loading, error, reload,
    urlSearch, urlGroup, urlStatus, urlPage,
    searchInput, setSearchInput, updateFilter, handlePageChange,
  };
}
