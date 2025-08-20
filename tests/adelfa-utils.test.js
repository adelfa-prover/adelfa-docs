import { describe, it, expect } from "vitest";
import { getOutputParts } from "../transformers/adelfa-utils.mjs";

describe("getOutputParts", () => {
  it("debug: show actual output parts", () => {
    const input = `Welcome!
>> Specification "unique.lf".

>> Schema c := {T}(x:tm,y:of x T).

>> Theorem ty_independent: ctx  G:c, forall  T:o, {G |- T : ty} => {T : ty}.

Subgoal ty_independent:


ctx G:c, forall T, {G |- T : ty} => {T : ty}

ty_independent>> induction on 1.`;

    const parts = getOutputParts(input);

    console.log("Number of parts:", parts.length);
    parts.forEach((part, i) => {
      console.log(`Part ${i}:`, JSON.stringify(part.substring(0, 50)));
    });
  });

  it("should correctly parse unique.lst output", () => {
    const input = `Welcome!
>> Specification "unique.lf".

>> Schema c := {T}(x:tm,y:of x T).

>> Theorem ty_independent: ctx  G:c, forall  T:o, {G |- T : ty} => {T : ty}.

Subgoal ty_independent:


==================================
ctx G:c, forall T, {G |- T : ty} => {T : ty}

ty_independent>> induction on 1.`;

    const parts = getOutputParts(input);

    // The first part should be "Welcome!" (index 0)
    expect(parts[0]).toBe("Welcome!");

    // The second part should be empty or minimal for Specification (index 1)
    expect(parts[1]).toBe("");

    // The third part should be empty or minimal for Schema (index 2)
    expect(parts[2]).toBe("");

    // The fourth part should contain the Theorem output (index 3)
    expect(parts[3]).toContain("Subgoal ty_independent:");
    expect(parts[3]).toContain("ctx G:c, forall T, {G |- T : ty} => {T : ty}");
  });

  it("should handle commands with dots in subgoal names", () => {
    const input = `Welcome!
>> Theorem test: true.

Subgoal test:

==================================
true

test>> search.
Proof Completed!

>> Theorem test2: true.

Subgoal test2.1:

==================================
true

test2.1>> search.

Subgoal test2.2:

==================================
false

test2.2>> search.`;

    const parts = getOutputParts(input);

    expect(parts[0]).toBe("Welcome!");
    expect(parts[1]).toContain("Subgoal test:");
    expect(parts[2]).toContain("Proof Completed!");
    expect(parts[3]).toContain("Subgoal test2.1:");
    expect(parts[4]).toContain("Subgoal test2.2:");
  });

  it("should have empty beforehand if welcome not present", () => {
    const input = `>> Theorem test: true.

Subgoal test:

==================================
true

test>> search.
Proof Completed!`;

    const parts = getOutputParts(input);

    expect(parts[0]).toBe("");
    expect(parts[1]).toContain("Subgoal test:");
    expect(parts[2]).toContain("Proof Completed!");
  });

  it("should handle real input", () => {
    const input = `Welcome!
>> Specification "unique.lf".

>> Schema c := {T}(x:tm,y:of x T).

>> Theorem ty_independent: ctx  G:c, forall  T:o, {G |- T : ty} => {T : ty}.

Subgoal ty_independent:`;
    const parts = getOutputParts(input);
    expect(parts[0]).toBe('Welcome!');
    expect(parts[1]).toBe('');
    expect(parts[2]).toBe('');
  });
});
