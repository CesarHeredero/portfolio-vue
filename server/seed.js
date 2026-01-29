import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./src/models/Category.js";
import Skill from "./src/models/Skill.js";
import Job from "./src/models/Job.js";
import SecondaryExperience from "./src/models/SecondaryExperience.js";
import SpecialSection from "./src/models/SpecialSection.js";

dotenv.config();

// Cambia esto en la línea 11 de tus archivos de script
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/cesar_intranet";

const categories = [
  {
    name: "Lead UX/UI & Product Owner",
    description:
      "Dirección de experiencia de usuario y liderazgo de producto, alineando visión, diseño y objetivos de negocio.",
    coverImage: "",
    isVisible: true,
  },
  {
    name: "Automatización (n8n)",
    description:
      "Automatización de flujos y procesos usando n8n para conectar herramientas y reducir trabajo manual.",
    coverImage: "",
    isVisible: true,
  },
  {
    name: "Experimentación (A/B Testing)",
    description:
      "Diseño, ejecución y análisis de experimentos para optimizar conversión y producto.",
    coverImage: "",
    isVisible: true,
  },
  {
    name: "Formación / Speaker",
    description:
      "Formación, talleres y ponencias sobre producto, UX y cultura digital.",
    coverImage: "",
    isVisible: true,
  },
  {
    name: "Eventos (Wrestling/Pro-Wrestling)",
    description:
      "Gestión y producción de eventos de wrestling y entretenimiento en vivo.",
    coverImage: "",
    isVisible: true,
  },
];

const skills = [
  { name: "Diseño UX/UI", category: "Design", level: 5, isVisible: true },
  { name: "Sketch", category: "Design", level: 4, isVisible: true },
  { name: "Figma", category: "Design", level: 4, isVisible: true },
  { name: "Vue.js", category: "Development", level: 4, isVisible: true },
  { name: "WordPress", category: "Development", level: 4, isVisible: true },
  { name: "Xamarin", category: "Development", level: 3, isVisible: true },
  { name: "Adobe Suite", category: "Tools", level: 4, isVisible: true },
  { name: "n8n", category: "Tools", level: 3, isVisible: true },
];

const jobs = [
  {
    company: "Devoteam",
    title: "UX/UI Consultant",
    period: "December 2016 - Present",
    description:
      "Creación de UX/UI para proyectos nacionales e internacionales. Participante en el hackathon " +
      "Cardio Xplore" +
      " organizado por Daiichi-Sankyo, con premio europeo.",
    skills: ["UX/UI Design", "Sketch", "Prototyping", "Design Thinking", "User Research"],
    highlights: [
      "Premio europeo Cardio Xplore (Daiichi-Sankyo)",
      "Prototipado y diseño multi-plataforma",
    ],
    notableClients: ["Toyota", "Hyundai", "Sacyl", "Interflora", "SHAI Tajo"],
    isVisible: true,
  },
  {
    company: "Pamicom",
    title: "UX/UI Consultant",
    period: "July 2016 - November 2016",
    description:
      "UX/UI design para mejorar la web corporativa de pymes y el proyecto Referencia2.",
    skills: ["UX/UI Design", "WordPress", "Web Design", "Layout"],
    highlights: ["Proyecto Referencia2", "Mejora web corporativa"],
    notableClients: [],
    isVisible: true,
  },
  {
    company: "Succodimore",
    title: "UX Consultant and Layout Designer",
    period: "June 2015 - May 2016",
    description:
      "Creación de flujos de navegación, investigación UX y coordinación con equipos para la distribuidora italiana.",
    skills: ["UX Design", "User Research", "Layout", "Email Design"],
    highlights: ["Investigación UX", "Coordinación interdepartamental"],
    notableClients: [],
    isVisible: true,
  },
  {
    company: "Me Gusta verte sonreír",
    title: "UX/UI Consultant and Layout Designer",
    period: "2015 - 2016",
    description:
      "Colaboración en UX/UI para un sitio de organización de encuentros y actividades.",
    skills: ["UX/UI Design", "WordPress", "Web Design", "Layout"],
    highlights: ["Experiencia de usuario simple e intuitiva"],
    notableClients: [],
    isVisible: true,
  },
];

const secondaryExperiences = [
  {
    title: "Mulafest 2014",
    role: "Video Editor",
    date: "June 2014",
    description: "Edición y postproducción audiovisual para el evento.",
    isVisible: true,
  },
  {
    title: "Delux Madrid",
    role: "Machine Room and MTI",
    date: "Summers 2009 and 2012",
    description: "Soporte técnico en sala de máquinas y coordinación MTI.",
    isVisible: true,
  },
  {
    title: "Chello Multicanal",
    role: "Duplicates Department",
    date: "Summer 2010",
    description: "Gestión de duplicados y soporte técnico audiovisual.",
    isVisible: true,
  },
  {
    title: "Serena Audiovisual",
    role: "Machine Room Internship",
    date: "April 2009 - June 2009",
    description: "Prácticas en sala de máquinas audiovisual.",
    isVisible: true,
  },
];

const specialSections = [
  {
    slug: "formacion",
    title: "Formación / Speaker",
    description:
      "Formación, talleres y ponencias sobre producto, UX y cultura digital.",
    longDescription:
      "Sesiones formativas y charlas enfocadas en producto digital, diseño centrado en el usuario y cultura de equipos.",
    image: "",
    isVisible: true,
  },
  {
    slug: "wrestling",
    title: "Wrestling / Pro-Wrestling",
    description:
      "Gestión y producción de eventos de wrestling y entretenimiento en vivo.",
    longDescription:
      "Coordinación de eventos, producción técnica y promoción de espectáculos de wrestling.",
    image: "",
    isVisible: true,
  },
];

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    const counts = await Promise.all([
      Category.countDocuments(),
      Skill.countDocuments(),
      Job.countDocuments(),
      SecondaryExperience.countDocuments(),
      SpecialSection.countDocuments(),
    ]);

    const total = counts.reduce((acc, value) => acc + value, 0);

    if (total === 0) {
      await Category.insertMany(categories);
      await Skill.insertMany(skills);
      await Job.insertMany(jobs);
      await SecondaryExperience.insertMany(secondaryExperiences);
      await SpecialSection.insertMany(specialSections);
      console.log("Seed completado: categorías, skills y experiencia creadas.");
    } else {
      console.log("Seed omitido: la base de datos ya tiene datos.");
    }
  } catch (error) {
    console.error("Error al ejecutar seed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
