export const priceFormat = (price) => {
  if (typeof price !== "number") {
    price = parseFloat(price);
    if (isNaN(price)) return "0 đ";
  }

  return price.toLocaleString("vi-VN") + " đ";
};
