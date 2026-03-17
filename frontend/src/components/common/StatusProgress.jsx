import { formatOptionLabel } from "../../utils/formatOptions";

const STATUS_STEPS = ["uploaded", "printing", "ready", "completed"];

function StatusProgress({ currentStatus }) {
  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="status-progress">
      {STATUS_STEPS.map((step, index) => {
        const isActive = currentIndex >= index;
        const isCurrent = currentStatus === step;

        return (
          <div className="status-step" key={step}>
            <div
              className={`status-step-circle ${isActive ? "active" : ""} ${
                isCurrent ? "current" : ""
              }`}
            >
              {isActive ? "●" : "○"}
            </div>

            <div className={`status-step-label ${isActive ? "active" : ""}`}>
              {formatOptionLabel(step)}
            </div>

            {index < STATUS_STEPS.length - 1 && (
              <div
                className={`status-step-line ${currentIndex > index ? "active" : ""}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StatusProgress;
