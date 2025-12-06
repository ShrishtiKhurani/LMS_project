import React from "react";
import { assets, dummyTestimonial } from "../../assets/assets";

const TestieMonialsSection = () => {
  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      {/* Heading Section */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          What Our Learners Say
        </h2>
        <p className="text-gray-500 mt-4 text-base md:text-lg leading-relaxed">
          Hear from learners around the world who have transformed their skills
          and careers through our expert-led courses. Each success story
          reflects our commitment to quality learning and practical outcomes.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {dummyTestimonial.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 flex flex-col justify-between"
          >
            {/* Header: Image + Name + Role */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover shadow-sm"
              />
              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(testimonial.rating)
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                  className="w-4 h-4"
                />
              ))}
              <p className="text-sm text-gray-500 ml-1">
                {testimonial.rating.toFixed(1)}
              </p>
            </div>

            {/* Feedback */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed italic line-clamp-4">
              “{testimonial.feedback}”
            </p>

            <a
              href="#"
              className="mt-5 text-blue-500 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
              Read more →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestieMonialsSection;
