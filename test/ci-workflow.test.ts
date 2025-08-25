import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import yaml from "js-yaml";

interface WorkflowStep {
  uses?: string;
  run?: string;
  name?: string;
}

interface WorkflowJob {
  "runs-on": string;
  steps: WorkflowStep[];
}

interface GitHubWorkflow {
  name?: string;
  on: string | string[] | Record<string, unknown>;
  jobs: Record<string, WorkflowJob>;
}

const WORKFLOW_PATH = join(process.cwd(), ".github/workflows/ci.yml");

describe("CI Workflow Configuration", () => {
  it("should have workflow file", () => {
    expect(existsSync(WORKFLOW_PATH)).toBe(true);
  });

  it("should be valid YAML", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    expect(() => yaml.load(workflowContent)).not.toThrow();
  });

  it("should trigger on pull request events", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    const workflow = yaml.load(workflowContent) as GitHubWorkflow;

    expect(workflow.on).toEqual(expect.arrayContaining(["pull_request"]));
  });

  it("should have lint job", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    const workflow = yaml.load(workflowContent) as GitHubWorkflow;

    expect(workflow.jobs.lint).toBeDefined();
    expect(workflow.jobs.lint.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          run: expect.stringContaining("bun run lint:scripts"),
        }),
      ])
    );
  });

  it("should have test job", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    const workflow = yaml.load(workflowContent) as GitHubWorkflow;

    expect(workflow.jobs.test).toBeDefined();
    expect(workflow.jobs.test.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          run: expect.stringContaining("bun test"),
        }),
      ])
    );
  });

  it("should have build job", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    const workflow = yaml.load(workflowContent) as GitHubWorkflow;

    expect(workflow.jobs.build).toBeDefined();
    expect(workflow.jobs.build.steps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          run: expect.stringContaining("bun run build"),
        }),
      ])
    );
  });

  it("should use correct Bun setup in all jobs", () => {
    const workflowContent = readFileSync(WORKFLOW_PATH, "utf-8");
    const workflow = yaml.load(workflowContent) as GitHubWorkflow;

    const jobs = ["lint", "test", "build"];
    jobs.forEach(jobName => {
      expect(workflow.jobs[jobName].steps).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            uses: expect.stringContaining("oven-sh/setup-bun"),
          }),
        ])
      );
    });
  });
});
