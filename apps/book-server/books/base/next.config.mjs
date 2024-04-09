import nextraConfig from "nextra";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: true,
};

const r = nextraConfig({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  ...nextConfig,
});

export default r();
