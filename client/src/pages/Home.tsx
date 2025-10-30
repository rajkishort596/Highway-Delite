import { useEffect, useState } from "react";
import { getExperiences } from "../api/experience.Api.js";
import ExperienceCard from "../components/ExperienceCard";
import Spinner from "../components/Spinner.js";
const Home = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences();
        console.log(data);
        setExperiences(data);
      } catch (err) {
        console.error("Failed to fetch Experiences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[90vh]">
        <Spinner />
      </div>
    );

  return (
    <div className="py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {experiences.map((exp) => (
        <ExperienceCard key={exp._id} experience={exp} />
      ))}
    </div>
  );
};
export default Home;
