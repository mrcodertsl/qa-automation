import { devConfig } from "./dev.config";
import { testConfig } from "./test.config";

const configs = {
    dev: devConfig,
    test: testConfig,
} as const;

const env = process.env.ENV ?? "test";

if (!(env in configs)) {
    throw new Error(`Unknown ENV: ${env}`);
}

export const config = configs[env as keyof typeof configs];