/** Technologies and capabilities listed in the supplied CV; no numeric proficiency scores. */
export const SKILL_GROUPS = [
  { id: "languages", title: "Programming languages", items: ["Java 8 / 17 / 21", "JavaScript", "TypeScript", "SQL", "PL/SQL"] },
  { id: "backend", title: "Backend", items: ["Spring Boot", "REST APIs", "Microservices", "Node.js", "Maven", "JPA/JDBC"] },
  { id: "frontend", title: "Frontend", items: ["React", "Angular", "HTML5", "CSS3", "Bootstrap", "PrimeNG"] },
  { id: "data", title: "Data and messaging", items: ["Oracle", "PostgreSQL", "MySQL", "SQL Server", "RabbitMQ", "Kafka"] },
  { id: "cloud", title: "Cloud and DevOps", items: ["AWS", "Google Cloud Platform", "Docker", "Kubernetes (working knowledge)", "Git", "Linux", "CI/CD"] },
  { id: "quality", title: "Quality and delivery", items: ["JUnit", "Unit and integration testing", "QA collaboration", "Incident analysis", "Technical documentation"] },
  { id: "design", title: "Design and collaboration", items: ["Solution design", "Legacy modernization", "Technical planning", "Cross-functional collaboration"] },
] as const;
