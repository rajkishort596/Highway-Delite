import React from "react";
import { Link } from "react-router-dom";
// @ts-ignore:
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface IExperienceCardProps {
  experience: {
    _id: string;
    name: string;
    location: string;
    description: string;
    price: number;
    imageUrl: string;
  };
}

const ExperienceCard = ({ experience }: IExperienceCardProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
      {/* Lazy Loaded Image with Blur */}
      <LazyLoadImage
        src={experience.imageUrl}
        alt={experience.name}
        effect="blur"
        wrapperClassName="w-full h-48 block"
        className="w-full h-48 object-cover block"
      />

      {/* Content */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-black">
            {experience.name}
          </h2>
          <span className="bg-grey8 text-black text-xs font-medium px-2 py-1 rounded-md">
            {experience.location}
          </span>
        </div>

        <p className="text-grey5 text-xs leading-snug line-clamp-2 mt-3 mb-5">
          {experience.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <p className="text-black text-xs flex items-center">
            From&nbsp;
            <span className="font-medium text-xl ml-1">
              ₹{experience.price}
            </span>
          </p>
          <Link
            to={`/details/${experience._id}`}
            className="bg-yellow text-black font-medium text-sm py-1.5 px-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ExperienceCard);
