export const EXPERIENCE_LIST = ["experience-ui-ux", "experience-full-stack"] as const;

export type ExperienceId = (typeof EXPERIENCE_LIST)[number];

export const EXPERIENCE_PATHS: Record<ExperienceId, string> = {
  "experience-ui-ux": "~/experiences/experience-ui-ux",
  "experience-full-stack": "~/experiences/experience-full-stack",
};
