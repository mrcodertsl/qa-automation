export const Passwords = {
    STANDARD_PASSWORD: process.env.STANDARD_PASSWORD ?? "",
    WRONG_PASSWORD: process.env.WRONG_PASSWORD ?? ""
} as const;

export const Usernames = {
    STANDARD: "standard_user",
    LOCKED_OUT: "locked_out_user",
    PROBLEM: "problem_user",
    PERFORMANCE_GLITCH: "performance_glitch_user",
} as const;