interface Prop {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="my-5 overflow-x-auto rounded-lg" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: "#18181b", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 font-medium text-xs tracking-wide uppercase"
                style={{ color: "#71717a" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr
              key={p.name}
              style={{ borderBottom: i < props.length - 1 ? "1px solid rgba(255,255,255,0.04)" : undefined }}
            >
              <td className="px-4 py-3 font-medium" style={{ fontFamily: "monospace", color: "#d8d8d8" }}>
                {p.name}
                {p.required && <span className="ml-1 text-xs" style={{ color: "#f87171" }}>*</span>}
              </td>
              <td className="px-4 py-3" style={{ fontFamily: "monospace", color: "#b7b7b7", fontSize: "0.8125rem" }}>
                {p.type}
              </td>
              <td className="px-4 py-3" style={{ fontFamily: "monospace", color: "#71717a", fontSize: "0.8125rem" }}>
                {p.default ?? "—"}
              </td>
              <td className="px-4 py-3" style={{ color: "#a1a1aa" }}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
