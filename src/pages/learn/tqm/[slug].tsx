import Head from "next/head";
import Link from "next/link";
import type { GetServerSideProps } from "next";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

type Course = {
  id: string;
  title: string;
  description?: string;
  url?: string;              // if external, we show "Open Lesson"
  content?: string;          // optional long-form markdown/plain
  outline?: string[];        // optional bullets
  resources?: { label: string; href: string }[];
};

function initDb() {
  if (!getApps().length) {
    if (!process.env.FB_ADMIN_PROJECT_ID) {
      // fallback to GOOGLE_APPLICATION_CREDENTIALS if set locally
      initializeApp();
    } else {
      initializeApp({
        credential: cert({
          projectId: process.env.FB_ADMIN_PROJECT_ID!,
          clientEmail: process.env.FB_ADMIN_CLIENT_EMAIL!,
          privateKey: process.env.FB_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }
  }
  return getFirestore();
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const slug = String(ctx.params?.slug || "");
  const db = initDb();

  const snap = await db
    .collection("learnPaths")
    .doc("tqm-essentials")
    .collection("courses")
    .doc(slug)
    .get();

  if (!snap.exists) return { notFound: true };

  const data = snap.data() || {};
  const course: Course = {
    id: slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    url: data.url,
    content: data.content ?? "",
    outline: Array.isArray(data.outline) ? data.outline : [],
    resources: Array.isArray(data.resources) ? data.resources : [],
  };

  return { props: { course } };
};

export default function TqmLesson({ course }: { course: Course }) {
  const external = !!course.url && /^https?:\/\//i.test(course.url);

  return (
    <>
      <Head>
        <title>{course.title} • TQM Essentials • RewmoAI</title>
      </Head>

      <div className="min-h-screen bg-[#003B49] text-white">
        <div className="mx-auto max-w-4xl px-4 py-10">
          <Link
            href="/learn"
            className="text-sm text-[#B6E7EB] hover:text-white"
          >
            ← Back to Learn
          </Link>

          <header className="mt-3">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#FF9151]">
              {course.title}
            </h1>
            {course.description && (
              <p className="mt-2 text-[#B6E7EB]">{course.description}</p>
            )}
          </header>

          {/* Outline */}
          {course.outline?.length ? (
            <section className="mt-6 rounded-2xl border border-[#15C5C1]/40 bg-[#072b33] p-5">
              <h2 className="text-xl font-bold text-[#15C5C1]">What you’ll learn</h2>
              <ul className="mt-3 list-disc pl-6 space-y-2 text-[#B6E7EB]">
                {course.outline.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* Content */}
          {course.content ? (
            <section className="mt-6 rounded-2xl border border-white/10 bg-[#072b33] p-5">
              <h2 className="text-xl font-bold text-white">Lesson</h2>
              <p className="mt-3 whitespace-pre-wrap text-[#F7F6F2]">
                {course.content}
              </p>
            </section>
          ) : null}

          {/* Resources */}
          {course.resources?.length ? (
            <section className="mt-6 rounded-2xl border border-white/10 bg-[#072b33] p-5">
              <h2 className="text-xl font-bold text-white">Resources</h2>
              <ul className="mt-3 space-y-2">
                {course.resources.map((r, i) => (
                  <li key={i}>
                    <a
                      className="underline text-[#FF9151] hover:text-[#FFB98E]"
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* External CTA */}
          {external && (
            <div className="mt-8">
              <a
                href={course.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[#FF6B00] px-4 py-3 text-sm font-bold text-white hover:bg-[#ff7d22]"
              >
                Open Lesson
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
