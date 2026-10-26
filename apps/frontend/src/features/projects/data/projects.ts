/** Projects documented in the supplied CV. No project-specific dates or public URLs were provided. */
export const PROJECTS = [
  {
    "id": "sppi",
    "title": "SPPI Enterprise Modernization",
    "company": "Grupo Salinas",
    "category": "Enterprise modernization",
    "summary": "Modernization of enterprise services from Java 8 to Java 21, including REST integrations and AWS migration.",
    "contributions": [
      "Refactored legacy components and developed REST APIs with Spring Boot, Maven, Oracle, and PL/SQL.",
      "Contributed to testing, certification, and deployments through IEECO."
    ],
    "technologies": [
      "Java 8 / 21",
      "Spring Boot",
      "Maven",
      "Oracle",
      "PL/SQL",
      "REST APIs",
      "AWS"
    ],
    "metric": null
  },
  {
    "id": "infobionic",
    "title": "InfoBionic U.S. Healthcare Platform",
    "company": "Grupo Salinas",
    "category": "Healthcare",
    "summary": "Full stack feature development for a U.S. healthcare platform using React, Node.js, PostgreSQL, and AWS.",
    "contributions": [
      "Built platform features and REST API integrations.",
      "Contributed to solution structuring, technical documentation, system diagrams, and cross-functional coordination."
    ],
    "technologies": [
      "React",
      "Node.js",
      "PostgreSQL",
      "REST APIs",
      "AWS"
    ],
    "metric": null
  },
  {
    "id": "dfc-alerts",
    "title": "DFC Alerts",
    "company": "Atos · The Home Depot",
    "category": "Retail",
    "summary": "Modernization of front-end and back-end components for an enterprise notification platform.",
    "contributions": [
      "Modernized the platform using Java, Spring Boot, Angular, and Oracle.",
      "Improved notification efficiency by 40%."
    ],
    "technologies": [
      "Java",
      "Spring Boot",
      "Angular",
      "Oracle"
    ],
    "metric": "40% improvement in notification efficiency"
  },
  {
    "id": "r2r-monitoring",
    "title": "R2R Monitoring Platform",
    "company": "Atos · The Home Depot",
    "category": "Monitoring",
    "summary": "Monitoring workflows for the Miami and Houston environments.",
    "contributions": [
      "Developed monitoring workflows using Java, Spring Boot, PostgreSQL, and RabbitMQ."
    ],
    "technologies": [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "RabbitMQ"
    ],
    "metric": null
  },
  {
    "id": "delivery-application",
    "title": "Delivery Application",
    "company": "Atos · The Home Depot",
    "category": "Logistics",
    "summary": "A delivery platform supporting internal logistics and operational workflows.",
    "contributions": [
      "Contributed to delivery-platform development using React, JavaScript, Docker, and Google Cloud Platform."
    ],
    "technologies": [
      "React",
      "JavaScript",
      "Docker",
      "Google Cloud Platform"
    ],
    "metric": null
  },
  {
    "id": "ecommerce",
    "title": "E-commerce Training Platform",
    "company": "Atos",
    "category": "Engineering program",
    "summary": "An Amazon-inspired e-commerce platform built as part of an enterprise engineering program.",
    "contributions": [
      "Built an e-commerce platform with Java, Spring Boot, React, Oracle, and REST APIs."
    ],
    "technologies": [
      "Java",
      "Spring Boot",
      "React",
      "Oracle",
      "REST APIs"
    ],
    "metric": null
  },
  {
    "id": "government-portals",
    "title": "Government Inventory Systems & Web Portals",
    "company": "OITIC - Operaciones Inteligentes",
    "category": "Government",
    "summary": "Inventory systems and web portals for SEDESOL, SEGOB Puebla, and UPM.",
    "contributions": [
      "Developed solutions with Java, React, and Bootstrap, from feature implementation to production maintenance.",
      "Administered CentOS servers and supported deployments, technical issues, and application stability."
    ],
    "technologies": [
      "Java",
      "React",
      "Bootstrap",
      "CentOS"
    ],
    "metric": null
  }
] as const;

export type ProjectId = (typeof PROJECTS)[number]["id"];
