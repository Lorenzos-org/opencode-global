import { describe, it, expect, mock, beforeEach, afterAll } from "bun:test";

const mock$ = mock(() => ({
  text: () => Promise.resolve(""),
}));

const original$ = Bun.$;
Bun.$ = mock$;

afterAll(() => {
  Bun.$ = original$;
});

describe("mgrep", async () => {
  const mgrep = (await import("./mgrep")).default;

  beforeEach(() => {
    mock$.mockClear();
    mock$.mockImplementation(() => ({
      text: () => Promise.resolve(""),
    }));
  });

  const getCommand = (call: any[]) => {
    const [template, ...values] = call;
    let command = template[0];
    for (let i = 0; i < values.length; i++) {
      command += values[i] + (template[i + 1] || "");
    }
    return command.trim();
  };

  it("should execute the correct shell command with default arguments", async () => {
    await mgrep.execute({ q: "test query", m: 10, a: false });
    const command = getCommand(mock$.mock.calls[0]);
    expect(command).toBe("mgrep search -m 10 test query");
  });

  it("should execute the correct shell command with a custom 'm' argument", async () => {
    await mgrep.execute({ q: "test query", m: 20, a: false });
    const command = getCommand(mock$.mock.calls[0]);
    expect(command).toBe("mgrep search -m 20 test query");
  });

  it("should execute the correct shell command with the 'a' flag", async () => {
    await mgrep.execute({ q: "test query", m: 10, a: true });
    const command = getCommand(mock$.mock.calls[0]);
    expect(command).toBe("mgrep search -m 10 -a test query");
  });

  it("should return the trimmed result of the shell command", async () => {
    mock$.mockImplementation(() => ({
      text: () => Promise.resolve("  test result  "),
    }));

    const result = await mgrep.execute({ q: "test query", m: 10, a: false });
    expect(result).toBe("test result");
  });
});
