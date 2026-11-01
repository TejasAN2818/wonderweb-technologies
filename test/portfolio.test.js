// Runtime validation coverage for the portfolio's configured content.
import assert from "node:assert/strict";
import test from "node:test";
import { experience, profile, projects, skills, stats } from "../src/data/portfolio.js";

test("profile includes the contact and identity details used by the UI", () => {
  assert.ok(profile.name);
  assert.ok(profile.initials);
  assert.match(profile.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.ok(profile.github);
  assert.ok(profile.linkedin);
});

test("projects have unique identifiers and complete card content", () => {
  const ids = projects.map(({ id }) => id);
  assert.equal(new Set(ids).size, projects.length);
  assert.ok(projects.length > 0);

  for (const project of projects) {
    assert.ok(project.title);
    assert.ok(project.category);
    assert.ok(project.description);
    assert.ok(project.tags.length > 0);
    assert.ok(project.demo);
    assert.ok(project.github);
  }
});

test("portfolio sections have content for each rendered collection", () => {
  assert.ok(stats.length > 0);
  assert.ok(skills.length > 0);
  assert.ok(experience.length > 0);
  assert.ok(projects.some(({ featured }) => featured));
  assert.ok(projects.some(({ featured }) => !featured));
});
