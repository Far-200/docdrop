export const formatOptionLabel = (value) => {
  if (!value) return "-";

  const map = {
    black_white: "Black & White",
    color: "Color",
    single_side: "Single Side",
    double_side: "Double Side",
    portrait: "Portrait",
    landscape: "Landscape",
    none: "None",
    spiral: "Spiral",
    stapled: "Stapled",
    uploaded: "Uploaded",
    confirmed: "Confirmed",
    printing: "Printing",
    ready: "Ready",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  if (map[value]) return map[value];

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
