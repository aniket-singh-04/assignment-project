export default function RatingInput({ rating, onRate, disabled }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRate(star)}
          className={`text-2xl ${
            rating >= star ? 'text-yellow-400' : 'text-gray-300'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:scale-110 transition-transform'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
