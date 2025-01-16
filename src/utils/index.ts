export const getCurrentDate = () => {
  const date = new Date();

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};
