export const validateStringNumber = (min, max) => (_, string) => {
  const value = Number(string);
  return !(isNaN(value) || value < min || value > max);
};
