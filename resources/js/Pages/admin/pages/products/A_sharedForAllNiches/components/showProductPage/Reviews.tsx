import React, { useEffect, useRef, useState } from "react";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    userName: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely love this product! The quality is outstanding and it fits perfectly.",
    date: "10 Oct 2024",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    userName: "Mike Chen",
    rating: 4,
    comment: "Premium feel and clean design. Would love more color options.",
    date: "08 Oct 2024",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    userName: "Emma Davis",
    rating: 5,
    comment: "Exceeded my expectations. Will definitely buy again.",
    date: "05 Oct 2024",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

const renderStars = (rating: number) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
      />
    ))}
  </div>
);

const Reviews = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<any | null>(null);

  const [newReview, setNewReview] = useState({
    userName: "",
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);

  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  const next = () => setIndex((i) => (i + 1) % reviews.length);
  const prev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 3000);
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [reviews.length]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.rating || !newReview.comment) return;

    const review: Review = {
      id: Date.now().toString(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    };

    setReviews([review, ...reviews]);
    setNewReview({ userName: "", rating: 0, comment: "" });
    setIndex(0);
  };

  const interactiveStars = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setNewReview({ ...newReview, rating: s })}
          onMouseEnter={() => setHoveredRating(s)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <Star
            className={`w-5 h-5 transition ${s <= (hoveredRating || newReview.rating)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-12">
      {/* FIRST SECTION – SUMMARY + SLIDER */}
      <section className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-stretch">
        <div className="bg-white rounded-2xl border p-6 flex flex-col justify-between">
          <div>
            <div className="text-5xl font-bold">{avg.toFixed(1)}</div>
            <div className="mt-2">{renderStars(Math.round(avg))}</div>
            <p className="text-sm text-slate-500 mt-1">Based on {reviews.length} reviews</p>
          </div>

          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = reviews.filter((rv) => rv.rating === r).length;
              const pct = (count / reviews.length) * 100;
              return (
                <div key={r} className="flex items-center gap-2">
                  <span className="text-sm w-4">{r}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="w-full bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between h-full">
            <div className="flex items-center gap-3 mb-4">
              <img src={reviews[index].avatar} className="w-12 h-12 rounded-full" />
              <div>
                <div className="font-medium">{reviews[index].userName}</div>
                <div className="text-xs text-slate-500">{reviews[index].date}</div>
              </div>
            </div>

            {renderStars(reviews[index].rating)}
            <p className="text-slate-700 mt-4 leading-relaxed flex-1">{reviews[index].comment}</p>
          </div>

          <button onClick={prev} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={next} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ADD REVIEW FORM */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 shadow-lg w-full">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={newReview.userName}
            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border"
          />

          {interactiveStars()}

          <textarea
            rows={4}
            placeholder="Share your experience with this product..."
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border resize-none"
          />

          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold">
            Submit Review
          </button>
        </form>
      </div>

      {/* FULL REVIEWS LIST */}
      {/* <div className="space-y-4">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-2xl border shadow">
            <div className="flex gap-4">
              <img src={review.avatar} className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h4 className="font-semibold">{review.userName}</h4>
                  <span className="text-sm text-slate-500">{review.date}</span>
                </div>
                {renderStars(review.rating)}
                <p className="mt-2 text-slate-700">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Reviews;

