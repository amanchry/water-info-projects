// components/CustomTooltip.jsx
import { Cross1Icon } from "@radix-ui/react-icons";
import React from "react";

const CustomTooltip = ({
  step,
  index,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  stepIndex,
  steps,
}) => {

  return (
    <div
      {...tooltipProps}
      className="rounded-lg bg-lightGray1 shadow-lg max-w-md text-gray-800"
    >
      <div className="flex justify-between items-center bg-[var(--gray-2)] rounded-t-lg p-6 pb-3">
        <div className="pagination text-center mt-2 text-xs text-gray2">
          {index + 1} of {Array.isArray(steps) && steps.length ? steps.length : 1}
        </div>
        <button
          {...closeProps}
          className="text-sm text-gray-400 hover:text-gray-600 "
        >
          <Cross1Icon />
        </button>
      </div>

      <h2 className="text-xl font-medium px-6 pb-3">{step.title}</h2>
      <div className="text-xs ">{step.content}</div>
      <div className="flex justify-between gap-2 bg-white rounded-b-lg p-4">
        {index > 0 && (
          <button {...backProps} className="text-sm text-gray-500">
            Back
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button
            {...primaryProps}
            className="bg-primary2 text-white text-sm px-6 py-2 rounded"
          >
            {isLastStep ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTooltip;
