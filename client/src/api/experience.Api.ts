import axios from "../axios.ts";

export const getExperiences = async () => {
  try {
    const res = await axios.get("/experiences");
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch All Experiences");
  }
};

export const getExperienceById = async (id: string) => {
  try {
    const res = await axios.get(`/experiences/${id}`);
    return res.data.data;
  } catch (error) {
    console.error(`Failed to fetch Experience with id:${id}`);
  }
};
