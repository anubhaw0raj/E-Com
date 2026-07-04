interface RatingStarsProps {
  rating: number;
  size?: string;
}

// Renders a 5-star row, filled according to the rating (rounded to nearest)
function RatingStars({ rating, size = "text-base" }: RatingStarsProps) {
  const rounded = Math.round(rating);
  return (
    <span className={`${size} text-yellow-400`} title={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= rounded ? "★" : "☆"}</span>
      ))}
      <span className="text-gray-400 ml-2 text-sm">{rating.toFixed(1)}</span>
    </span>
  );
}

export default RatingStars;
