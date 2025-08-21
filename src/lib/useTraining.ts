import { useEffect, useMemo, useState } from "react";

export function usePaths() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/training/paths")
      .then(r => r.json())
      .then(j => setData(j.paths || []))
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
      .then(r => r.json())
      .then(j => setData({ path: j.path, courses: j.courses || [] }))
      .finally(() => setLoading(false));
  }, [pathId]);

  return { ...data, loading };
}

export function useProgress(email?: string) {
  const hdrs: HeadersInit = useMemo(
    () => (email ? { "x-user-email": email } : {}),
    [email]
  );

  async function get() {
    const r = await fetch("/api/training/progress", { headers: hdrs });
    return r.json();
  }

  async function set(courseId: string, payload: { status?: string; percent?: number }, emailHdr?: string) {
    const r = await fetch("/api/training/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(emailHdr ? { "x-user-email": emailHdr } : hdrs),
      },
      body: JSON.stringify({ courseId, ...payload }),
    });
    return r.json();
  }

  return { get, set };
}
