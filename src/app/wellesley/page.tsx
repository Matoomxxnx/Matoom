export const dynamic = "force-dynamic";

type Role = "founder" | "leader" | "member";
type Member = {
  id: string;
  name: string;
  role: Role;
  facebook_url: string | null;
  avatar_url: string | null;
};

async function getMembers() {
  const res = await fetch("https://matoom.vercel.app/api/members", {
  cache: "no-store",
  });
  const json = await res.json();
  return (json?.data ?? []) as Member[];
}

export default async function WellesleyPage() {
  const members = await getMembers();
  const founders = members.filter((m) => m.role === "founder");
  const leaders = members.filter((m) => m.role === "leader");
  const normals = members.filter((m) => m.role === "member");

  return (
    <div style={{ padding: 24 }}>
      <h1>WELLESLEY MEMBERS</h1>

      <h2>FOUNDERS</h2>
      {founders.map((m) => (
        <div key={m.id}>{m.name}</div>
      ))}

      <h2>LEADERS</h2>
      {leaders.map((m) => (
        <div key={m.id}>{m.name}</div>
      ))}

      <h2>MEMBERS</h2>
      {normals.map((m) => (
        <div key={m.id}>{m.name}</div>
      ))}
    </div>
  );
}