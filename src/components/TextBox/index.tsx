import React from "react";

interface Props {
  text: string;
}

export function TextBox({ text }: Props): React.JSX.Element {
  return (
    <div className="w-96 h-96 max-w-full bg-primary-800 p-4 text-3xl">
      <p className="text-secondary-500">{">"}</p>
      <p className="text-secondary-500">
        {text}
        <span className="animate-blink">|</span>
      </p>
    </div>
  );
}
