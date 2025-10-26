import axios from "axios";
import { config } from "../config.js";

export const api = axios.create({
  baseURL: config.externalApi.baseURL,
  timeout: 10_000,
  headers: { Authorization: `Bearer ${config.externalApi.apiKey}` },
});
