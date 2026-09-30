interface Prop {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

/** Props reference on the tile surface, with mono labels like the landing page. */
export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="my-7 overflow-x-auto rounded-md bg-white/2">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} className="px-4 py-3 text-left font-mono text-xs font-normal text-white/35">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-white/4 align-top last:border-0">
              <td className="px-4 py-3 font-mono text-[0.8125rem] whitespace-nowrap text-white/85">
                {p.name}
                {p.required && (
                  <span className="ml-1" style={{ color: "var(--brand)" }} title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-[0.8125rem] whitespace-nowrap text-white/55">{p.type}</td>
              <td className="px-4 py-3 font-mono text-[0.8125rem] whitespace-nowrap text-white/35">{p.default ?? "—"}</td>
              <td className="px-4 py-3 leading-6 text-white/50">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
