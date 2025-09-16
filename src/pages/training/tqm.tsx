// src/pages/training/tqm.tsx
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/learn/rpm",
      permanent: true, // 308
    },
  };
}

export default function TqmRedirect() {
  return null;
}
