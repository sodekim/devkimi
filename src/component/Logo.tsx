const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100% 100%"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style="stop-color:var(--color-accent); stop-opacity:1"
          />
          <stop
            offset="100%"
            style="stop-color:var(--color-primary); stop-opacity:1"
          />
        </linearGradient>
      </defs>

      <text
        x="50%"
        y="55%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="48"
        font-weight="bold"
        fill="url(#grad1)"
      >
        Devkimi
      </text>
    </svg>
  );
};

export default Logo;
