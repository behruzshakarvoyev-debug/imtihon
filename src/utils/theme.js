export const getTheme = () => localStorage.getItem("theme") || "light";

export const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
};
