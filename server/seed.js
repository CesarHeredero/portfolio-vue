import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import Category from "./src/models/Category.js";
import Skill from "./src/models/Skill.js";
import Job from "./src/models/Job.js";
import SecondaryExperience from "./src/models/SecondaryExperience.js";
import SpecialSection from "./src/models/SpecialSection.js";
import About from "./src/models/About.js";
import Content from "./src/models/Content.js";
import Project from "./src/models/Project.js";
import User from "./src/models/User.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveLocaleModule = async (relativePaths) => {
  for (const relativePath of relativePaths) {
    const filePath = path.resolve(__dirname, relativePath);
    if (fs.existsSync(filePath)) {
      const module = await import(pathToFileURL(filePath).href);
      return module.default;
    }
  }
  throw new Error("No se encontraron archivos de locales para el seed.");
};

const enContent = await resolveLocaleModule([
  "../src/locales/en.js",
  "./locales/en.js",
]);
const esContent = await resolveLocaleModule([
  "../src/locales/es.js",
  "./locales/es.js",
]);

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

const toList = (value) =>
  (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const esJobs = esContent.experience?.jobs || {};
const enJobs = enContent.experience?.jobs || {};
const jobs = Object.entries(esJobs).map(([key, job]) => ({
  company: job.company,
  title: job.title,
  titleEn: enJobs[key]?.title || "",
  period: job.period,
  description: job.description,
  descriptionEn: enJobs[key]?.description || "",
  skills: toList(job.skills),
  highlights: [],
  notableClients: [],
  isVisible: true,
}));

const esAdditional = esContent.experience?.additional?.items || [];
const enAdditional = enContent.experience?.additional?.items || [];

const secondaryFromAdditional = esAdditional.map((item, index) => ({
  title: item.title,
  titleEn: enAdditional[index]?.title || "",
  role: item.skills || "",
  roleEn: enAdditional[index]?.skills || "",
  date: item.period,
  description: item.description || "",
  descriptionEn: enAdditional[index]?.description || "",
  isVisible: true,
}));

const esOther = esContent.experience?.other || {};
const enOther = enContent.experience?.other || {};
const otherKeys = ["mulafest", "delux", "chello", "serena"];
const secondaryFromOther = otherKeys
  .filter((key) => esOther[key])
  .map((key) => ({
    title: esOther[key].title,
    titleEn: enOther[key]?.title || "",
    role: esOther[key].role,
    roleEn: enOther[key]?.role || "",
    date: esOther[key].date,
    description: "",
    descriptionEn: "",
    isVisible: true,
  }));

const secondaryExperiences = [
  ...secondaryFromAdditional,
  ...secondaryFromOther,
];

const projects = [
  {
    title: "Sistema de Diseño UI",
    titleEn: "Sistema de Diseño UI",
    description:
      "Diseño y desarrollo de un sistema de diseño completo para una aplicación web empresarial, incluyendo componentes reutilizables y documentación detallada.",
    descriptionEn:
      "Diseño y desarrollo de un sistema de diseño completo para una aplicación web empresarial, incluyendo componentes reutilizables y documentación detallada.",
    mainImage: "https://via.placeholder.com/400x300",
    techStack: ["Figma", "Vue.js", "Storybook", "SCSS"],
    link: "https://design-system-demo.com",
    isVisible: true,
  },
  {
    title: "E-commerce UX Redesign",
    titleEn: "E-commerce UX Redesign",
    description:
      "Rediseño completo de la experiencia de usuario de una plataforma e-commerce, mejorando la conversión y satisfacción del usuario.",
    descriptionEn:
      "Rediseño completo de la experiencia de usuario de una plataforma e-commerce, mejorando la conversión y satisfacción del usuario.",
    mainImage: "https://via.placeholder.com/400x300",
    techStack: ["UX Research", "UI Design", "Prototipado", "Figma"],
    link: "https://ecommerce-redesign.com",
    isVisible: true,
  },
  {
    title: "App de Gestión Empresarial",
    titleEn: "App de Gestión Empresarial",
    description:
      "Diseño y desarrollo de una aplicación web para gestión empresarial con enfoque en usabilidad y eficiencia.",
    descriptionEn:
      "Diseño y desarrollo de una aplicación web para gestión empresarial con enfoque en usabilidad y eficiencia.",
    mainImage: "https://via.placeholder.com/400x300",
    techStack: ["React", "TypeScript", "Material UI", "Node.js"],
    link: "https://business-app-demo.com",
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

const aboutSections = [
  {
    title: esContent.about?.title || "Sobre mí",
    titleEn: enContent.about?.title || "About Me",
    description: esContent.about?.description || "",
    descriptionEn: enContent.about?.description || "",
    isVisible: true,
  },
];

const localizedContent = [
  { locale: "en", data: enContent, isVisible: true },
  { locale: "es", data: esContent, isVisible: true },
];

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

const run = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    const [
      categoryCount,
      skillCount,
      jobCount,
      secondaryCount,
      specialCount,
      projectCount,
      aboutCount,
      contentCount,
    ] = await Promise.all([
      Category.countDocuments(),
      Skill.countDocuments(),
      Job.countDocuments(),
      SecondaryExperience.countDocuments(),
      SpecialSection.countDocuments(),
      Project.countDocuments(),
      About.countDocuments(),
      Content.countDocuments(),
    ]);

    if (categoryCount === 0) {
      await Category.insertMany(categories);
    }
    if (skillCount === 0) {
      await Skill.insertMany(skills);
    }
    if (jobCount === 0) {
      await Job.insertMany(jobs);
    }
    if (secondaryCount === 0) {
      await SecondaryExperience.insertMany(secondaryExperiences);
    }
    if (specialCount === 0) {
      await SpecialSection.insertMany(specialSections);
    }
    if (projectCount === 0) {
      await Project.insertMany(projects);
    }

    if (
      categoryCount === 0 ||
      skillCount === 0 ||
      jobCount === 0 ||
      secondaryCount === 0 ||
      specialCount === 0 ||
      projectCount === 0
    ) {
      console.log("Seed completado: datos principales creados.");
    } else {
      console.log("Seed parcial: datos principales ya existen.");
    }

    if (aboutCount === 0) {
      await About.insertMany(aboutSections);
      console.log("Seed completado: sección Sobre mí creada.");
    } else {
      console.log("Seed omitido: sección Sobre mí ya existe.");
    }

    if (contentCount === 0) {
      await Content.insertMany(localizedContent);
      console.log("Seed completado: contenido localizado creado.");
    } else {
      console.log("Seed omitido: contenido localizado ya existe.");
    }

    if (adminEmail && adminPassword) {
      const normalizedEmail = adminEmail.trim().toLowerCase();
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const existingAdmin = await User.findOne({ email: normalizedEmail });

      if (existingAdmin) {
        existingAdmin.passwordHash = passwordHash;
        await existingAdmin.save();
        console.log("Seed completado: usuario admin actualizado.");
      } else {
        await User.create({ email: normalizedEmail, passwordHash });
        console.log("Seed completado: usuario admin creado.");
      }
    } else {
      console.log("Seed omitido: ADMIN_EMAIL/ADMIN_PASSWORD no configurados.");
    }
  } catch (error) {
    console.error("Error al ejecutar seed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
