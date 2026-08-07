export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .toString()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.toString().charAt(0).toUpperCase() + str.toString().slice(1).toLowerCase();
};
