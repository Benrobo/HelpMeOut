export const Spinner = ({ size = 25, color = "#fff" }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: `${color}`,
    borderRightColor: `${color}`,
    borderBottomColor: `transparent`,
    borderLeftColor: `transparent`,
  };

  return (
    <div
      id="showccial-spinner"
      className="rounded-full border-4 animate-spin-fast"
      style={spinnerStyle}
    ></div>
  );
};
