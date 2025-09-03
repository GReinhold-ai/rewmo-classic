import Link from "next/link";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

type PathItem = { id: string; title: string };
type ApiResp = { paths: PathItem[] };

export const getServerSideProps: GetServerSideProps<{ data: ApiResp | null }> = async ({ req }) => {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `http://${req.headers.host}`;
    const r = await fetch(`${base}/api/training/paths`);
    const data = (await r.json()) as ApiResp;
    return { props: { data } };
  } catch {
    return { props: { data: null } };
  }
};

export default function TrainingIndex(
  { data }: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  if (!data) return <main className="p-8">Failed to load training paths.</main>;
  const paths = data.paths;

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Training</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {paths.map((p) => (
          <li key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold mb-2">{p.title}</h2>
            <Link
              href={`/training/${encodeURIComponent(p.id)}`}
              className="inline-block rounded-lg bg-orange-500 text-white px-4 py-2"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
