import { useNavigate } from "react-router-dom";
import { lifecycleStages } from "../data/content";
import "./LifecycleRing.css";

type Props = {
  activeId?: string;
  compact?: boolean;
};

export function LifecycleRing({ activeId, compact = false }: Props) {
  const navigate = useNavigate();
  const size = compact ? 220 : 320;
  const cx = size / 2;
  const cy = size / 2;
  const radius = compact ? 78 : 112;

  return (
    <div className={`lifecycle-ring ${compact ? "is-compact" : ""}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="lifecycle-ring__svg"
        role="img"
        aria-label="Show lifecycle stages"
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(18,16,14,0.12)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        {lifecycleStages.map((stage, index) => {
          const angle =
            (Math.PI * 2 * index) / lifecycleStages.length - Math.PI / 2;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          const active = activeId
            ? activeId.toLowerCase() === stage.title.toLowerCase() ||
              activeId === stage.id
            : false;

          return (
            <g
              key={stage.id}
              className={`lifecycle-node ${active ? "is-active" : ""}`}
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/lifecycle#${stage.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/lifecycle#${stage.id}`);
                }
              }}
            >
              <circle
                cx={x}
                cy={y}
                r={compact ? 15 : 20}
                className="lifecycle-node__dot"
              />
              <text
                x={x}
                y={y + (compact ? 36 : 42)}
                textAnchor="middle"
                className="lifecycle-node__label"
              >
                {stage.title}
              </text>
            </g>
          );
        })}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="lifecycle-ring__center-title"
        >
          Lifecycle
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          className="lifecycle-ring__center-sub"
        >
          Eight stages
        </text>
      </svg>
    </div>
  );
}
