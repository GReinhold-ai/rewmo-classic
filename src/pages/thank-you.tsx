import { useEffect, useState } from "react";
import Head from "next/head";

export default function ThankYou() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // optionally fetch session details with session_id
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    // you can fetch /api/verify-subscription?session_id=... if desired
    setEmail(null);
  }, []);

  return (
    <>
      <Head><title>Welcome to RewmoAI + EnterpriseAI</title></Head>
      <main style={{minHeight:"60vh",display:"grid",placeItems:"center",padding:"40px"}}>
        <div style={{maxWidth:680}}>
          <h1>🎉 You’re in!</h1>
          <p>Watch your inbox for your RewmoAI & EnterpriseAI login details.</p>
          <a href="/login" style={{display:"inline-block",marginTop:16,background:"#FF7A1A",color:"#000",padding:"12px 18px",borderRadius:10,fontWeight:800,textDecoration:"none"}}>
            Go to App →
          </a>
        </div>
      </main>
    </>
  );
}
