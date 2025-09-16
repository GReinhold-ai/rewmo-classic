// src/pages/training/tqm.tsx
export default function TqmAlias() {
  if (typeof window !== "undefined") window.location.replace("/learn/rpm");
  return null;
}

// src/pages/tqm.tsx
export default function TqmRootAlias() {
  if (typeof window !== "undefined") window.location.replace("/learn/rpm");
  return null;
}

// (optional) if you ever linked /training/rpm → point it here too
// src/pages/training/rpm.tsx
export default function RpmAlias() {
  if (typeof window !== "undefined") window.location.replace("/learn/rpm");
  return null;
}
