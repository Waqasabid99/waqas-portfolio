import HomePage from "@/pages/Home/Homepage";

export const generateMetadata = async () => {
  return {
    title: "Waqas Abid | Full Stack Developer",
    description: "Promise to deliver best of best",
    keywords: ["Waqas Abid", "Full Stack Developer", "Web Developer", "React Developer", "Next.js Developer", "Node.js Developer", "Express.js Developer", "MongoDB Developer", "MERN Stack Developer", "MEAN Stack Developer", "MEVN Stack Developer", "Full Stack Developer", "Web Developer", "React Developer", "Next.js Developer", "Node.js Developer", "Express.js Developer", "MongoDB Developer", "MERN Stack Developer", "MEAN Stack Developer", "MEVN Stack Developer"],
  }
};

export default function Home() {
  return (
    <HomePage />
  );
}
