"use client";

interface GreetingHeaderProps {
  userName: string | null;
}

export function GreetingHeader({ userName }: GreetingHeaderProps) {
  const now = new Date();
  const hour = now.getHours();

  let greeting: string;
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";
  else greeting = "Good evening";

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ marginBottom: 32 }}>
      <h1
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#1B1C1B",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {greeting}{userName ? `, ${userName}` : ""}.
      </h1>
      <p
        style={{
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          fontSize: 14,
          color: "#5E5E65",
          marginTop: 8,
        }}
      >
        Here&apos;s your snapshot for {dateStr}.
      </p>
    </div>
  );
}
