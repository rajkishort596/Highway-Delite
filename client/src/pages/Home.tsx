import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getExperiences } from "../api/experience.Api";
import ExperienceCard from "../components/ExperienceCard";
import Spinner from "../components/Spinner";

interface IExperience {
  _id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Home = () => {
  const [experiences, setExperiences] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (err) {
        console.error("Failed to fetch Experiences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  // Filter experiences based on search query
  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return experiences;
    return experiences.filter((exp) =>
      exp.name.toLowerCase().includes(searchQuery)
    );
  }, [searchQuery, experiences]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spinner />
      </div>
    );

  return (
    <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredExperiences.length > 0 ? (
        filteredExperiences.map((exp) => (
          <ExperienceCard key={exp._id} experience={exp} />
        ))
      ) : (
        <p className="text-center text-gray-500 col-span-full">
          No experiences found.
        </p>
      )}
    </div>
  );
};

export default Home;
