import { Card, Typography } from "antd";
import React from "react";

/**
 * This is reusable Card
 * We passed some parameters to display as props
 */
function BookCard({ book_name, isbn_number, amount, author_name }) {
  /**
   * Convert integer to price format
   * eg:1000.3 to 1,000.30
   */
  const getPrice = (number) => {
    return number?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  return (
    <Card title={book_name}>
      <p>
        <Typography.Text strong>ISBN Number:</Typography.Text> {isbn_number}
      </p>
      <p>
        <Typography.Text strong> Author:</Typography.Text> {author_name}
      </p>
      <p>{getPrice(parseFloat(amount))}/=</p>
    </Card>
  );
}

export default BookCard;
