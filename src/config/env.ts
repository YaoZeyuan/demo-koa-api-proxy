let node_env = process.env.NODE_ENV ?? "dev"
export default node_env as "local" | "dev" | "test" | "pre" | "prod"