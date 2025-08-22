import type { GetServerSideProps } from "next";

export default function LoginAlias() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const q =
    typeof query.redirect === "string" && query.redirect.startsWith("/")
      ? `?redirect=${encodeURIComponent(query.redirect)}`
      : "";
  return { redirect: { destination: `/signin${q}`, permanent: false } };
};
