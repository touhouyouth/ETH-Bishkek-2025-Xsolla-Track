export const log = {
  info: (...a: unknown[]) => console.log("[INFO]", ...a),
  error: (...a: unknown[]) => console.error("[ERROR]", ...a),
};
