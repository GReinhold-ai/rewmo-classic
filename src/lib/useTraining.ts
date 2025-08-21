import { useEffect, useMemo, useState } from "react";

type ProgressPayload = { status?: string; percent?: number };

export function usePaths() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/paths")
      .then((r) => r.json())
      .then((j) => setData(j.paths || []))
      .finally(() => setLoading(false));
  }, []);

  return { paths: data, loading };
}

export function useCoursesByPath(pathId: string) {
  const [data, setData] = useState<{ path?: any; courses: any[] }>({ courses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pathId) return;
    setLoading(true);
    fetch(`/api/training/courses?path=${encodeURIComponent(pathId)}`)
      .then((r) => r.json())
      .then((j) => setData({ path: j.path, courses: j.courses || [] }))
      .finally(() => setLoading(false));
  }, [pathId]);

  return { ...data, loading };
}

export function useProgress(email?: string) {
  // Always a Record<string,string>, even when no email is present
  const hdrs = useMemo<Record<string, string>>(() => {
    const h: Record<string, string> = {};
    if (email) h["x-user-email"] = String(email);
    return h;
  }, [email]);

  async function get() {
    const r = await fetch("/api/training/progress", { headers: hdrs });
    return r.json();
  }

  async function set(courseId: string, payload: ProgressPayload, emailHdr?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(emailHdr ? { "x-user-email": String(emailHdr) } : hdrs),
    };

    const r = await fetch("/api/training/progress", {
      method: "POST",
      headers,
      body: JSON.stringify({ courseId, ...payload }),
    });
    return r.json();
  }

  return { get, set };
}
