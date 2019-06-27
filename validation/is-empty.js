// The function checks if the value is undefined or null or object or string
const isEmpty = val => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === "object" && Object.keys(val).length === 0) ||
    (typeof val === "string" && val.trim().length === 0)
  );
};

module.exports = isEmpty;
