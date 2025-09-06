export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home",
  "Sports",
  "Other",
];

export const validateCategory = (category) => {
  return PRODUCT_CATEGORIES.includes(category);
};
