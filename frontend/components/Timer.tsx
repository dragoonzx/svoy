import { useTimer } from "react-timer-hook";

const Timer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return (
    <div className="font-mono">
      {days ? <span>{days}d</span> : null} <span>{hours}h</span> <span>{minutes}m</span> <span>{seconds}s</span>
    </div>
  );
};

export default Timer;
