import { config } from "dotenv";
import { EnvVariables, EnvSchema } from "./types";

export class EnvironmentVariableService {
  private readonly variables: EnvVariables;

  constructor() {
    config();
    this.variables = EnvSchema.parse(process.env);
  }

  public get<T extends keyof EnvVariables>(key: T): EnvVariables[T] {
    const variable = this.variables[key];

    if (!variable) {
      throw new Error(`Environment variable "${key}" not found.`);
    }

    return variable;
  }
}
