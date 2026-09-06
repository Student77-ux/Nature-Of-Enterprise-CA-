import type { Metadata } from "next";
import NoticeForm from "@/components/NoticeForm";
import { formatDate, notices } from "@/lib/fixtures";

export const metadata: Metadata = {
  title: "Noticeboard",
  description:
    "Lost property, lift shares, volunteering and club notices for Tallaght Gaels members.",
};

export default function NoticeboardPage() {
  const sorted = [...notices].sort((a, b) => b.postedOn.localeCompare(a.postedOn));

  return (
    <>
      <h1>Noticeboard</h1>
      <p className="lede">
        The board in the clubhouse porch, online. Lost gear, lifts to away games, and anything the
        club needs hands for.
      </p>

      <div className="grid grid-2" style={{ alignItems: "start", marginTop: "1.6rem" }}>
        <section aria-labelledby="current">
          <h2 id="current">On the board</h2>
          <p className="result-count">{sorted.length} notices</p>
          {sorted.map((n) => (
            <article className="notice" key={n.id} style={{ marginBottom: "0.8rem" }}>
              <p className="meta" style={{ marginBottom: "0.25rem" }}>
                {n.kind} · {n.contactArea} · posted {formatDate(n.postedOn, "short")}
              </p>
              <h3 style={{ fontSize: "1.05rem" }}>{n.title}</h3>
              <p className="meta" style={{ marginBottom: 0 }}>
                {n.body}
              </p>
            </article>
          ))}
        </section>

        <section aria-labelledby="post">
          <h2 id="post">Post a notice</h2>
          <p>
            A club volunteer reads submissions each evening. Anything with a phone number or a
            child&rsquo;s name in it is edited before it goes up.
          </p>
          <NoticeForm />
        </section>
      </div>
    </>
  );
}
