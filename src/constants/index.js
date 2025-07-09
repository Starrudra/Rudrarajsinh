import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
  Rapidops,
  Ath,
  Sanfinity,
  Social,
  Envision,
  Experro,
  Firebase
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Software Engineer",
    icon: web,
  },
  {
    title: "ReactJs Developer",
    icon: mobile,
  },
  {
    title: "Frontend Developer",
    icon: backend,
  },
  {
    title: "Software Developer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Firebase",
    icon: Firebase,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },

];

const experiences = [
  {
    title: "Software Developer",
    company_name: "Rapidops",
    icon: Rapidops,
    iconBg: "#383E56",
    date: "January 2025 ",
    points: [
      "Worked as a Software Developer Intern at Rapidops, focusing on frontend development using React.js and TypeScript",
      "Strengthened core JavaScript concepts while building conceptual projects with clean, scalable, and type-safe code",
      "Contributed to a live client project by developing and maintaining the storefront using reusable React components",
      "Gained real-world experience in writing production-level code with TypeScript in a professional environment",
    ],
  },
  {
    title: "ReactJs Developer",
    company_name: "Sanfinity Creative Solution",
    icon: Sanfinity,
    iconBg: "#E6DEDD",
    date: "June 2024",
    points: [
      "Gained hands-on experience in React development by building dynamic and responsive web applications",
      "Applied core React principles like components, hooks, and state management in real-world scenarios",
      "Contributed to the development of the company’s official website with a focus on clean and maintainable frontend code",
      "Created efficient, user-friendly interfaces to ensure a smooth and engaging user experience",
    ],
  },

  {
    title: "Web Developer",
    company_name: "Ath Software Solutions",
    icon: Ath,
    iconBg: "#E6DEDD",
    date: "June 2023 ",
    points: [
      "Actively worked with HTML, CSS, and JavaScript to enhance a live project's responsiveness across devices",
      "Ensured consistent performance and adaptable layouts for different screen sizes",
      "Focused on building user-friendly interfaces to improve overall user experience",
      "Strengthened skills in responsive web design and core UI/UX principles",
    ],
  },
];



const projects = [
  {
    name: "Social Sphere",
    description:"Designed and developed a social media app focused on user engagement and real-time communication, using React, Tailwind CSS, and Firebase for seamless UI and live backend integration. Implemented full CRUD functionality for posts, comments, and user profiles, along with a real-time one-to-one chat feature.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "Firebase",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: Social,
    source_code_link: "https://github.com/Starrudra/Rudrarajsinh/tree/main/Social_Media",
  },
  {
    name: "Envision-AI Enhanced Educational Video Generator",
    description:"Transforming learning through AI-powered, personalized educational videos by designing a tool that generates content based on user input. Integrated animated characters to deliver engaging, easy-to-understand explanations, focusing on enhancing the learning experience with interactive visuals and customized educational content.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "AWS",
        color: "red-text-gradient",
      },
      {
        name: "AI",
        color: "green-text-gradient",
      },
      {
        name: "ML",
        color: "blue-text-gradient",
      },
       {
        name: "MongoDB",
        color: "pink-text-gradient",
      },
    ],
    image: Envision,
    source_code_link: "https://github.com/Starrudra/Rudrarajsinh/tree/main",
  },
  {
    name: "Experro - A Dynamic Content Management System",
    description:"Empowering anyone to build powerful e-commerce websites with no coding required, the platform features a dynamic CMS designed specifically for online stores. It includes payment gateway integration, real-time data visualization, and all essential e-commerce functionalities like cart, product management, and order tracking. The intuitive no-code interface allows businesses to create, customize, and launch fully functional websites quickly and efficiently.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "React",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
      {
        name: "MongoDB",
        color: "blue-text-gradient",
      },
      {
        name: "Stripse",
        color: "green-text-gradient",
      },
      {
        name: "Nodejs",
        color: "blue-text-gradient",
      },
      {
        name: "Rust",
        color: "pink-text-gradient",
      },
    ],
    image: Experro,
    source_code_link: "https://github.com/Starrudra/Rudrarajsinh/tree/main/MajorProject-main",
  },
];

export { services, technologies, experiences,  projects };
