import { useState } from "react";

export function TextTruncateToggle({
  text,
  maxLength = 200,
}: {
  text: string;
  maxLength?: number;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <span>
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
        <button
          onClick={toggleReadMore}
          className="text-green-500 hover:underline ml-2 font-semibold"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </span>
    </div>
  );
}
