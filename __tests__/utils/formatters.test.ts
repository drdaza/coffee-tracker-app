import { formatEnumValue } from "@/utils/formatters";

describe("formatEnumValue", () => {
  it("formats single word enum values", () => {
    expect(formatEnumValue("LIGHT")).toBe("Light");
    expect(formatEnumValue("DARK")).toBe("Dark");
    expect(formatEnumValue("MEDIUM")).toBe("Medium");
  });

  it("formats multi-word enum values with underscores", () => {
    expect(formatEnumValue("MEDIUM_DARK")).toBe("Medium Dark");
    expect(formatEnumValue("FRENCH_PRESS")).toBe("French Press");
    expect(formatEnumValue("POUR_OVER")).toBe("Pour Over");
  });

  it("preserves first character case (only uppercases first char of each word)", () => {
    // formatEnumValue uses charAt(0) as-is, so lowercase input stays lowercase first char
    expect(formatEnumValue("light")).toBe("light");
    expect(formatEnumValue("medium_dark")).toBe("medium dark");
  });

  it("handles single character words", () => {
    expect(formatEnumValue("A_B")).toBe("A B");
  });

  it("handles empty segments from consecutive underscores", () => {
    // Edge case: consecutive underscores produce empty segments
    const result = formatEnumValue("A__B");
    expect(result).toBe("A  B");
  });
});
