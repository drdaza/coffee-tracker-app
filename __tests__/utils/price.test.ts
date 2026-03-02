import {
  centsToDollars,
  dollarsToCents,
  formatPrice,
  sanitizePriceInput,
} from "@/utils/price";

describe("centsToDollars", () => {
  it("converts cents to dollar string", () => {
    expect(centsToDollars(2500)).toBe("25.00");
    expect(centsToDollars(100)).toBe("1.00");
    expect(centsToDollars(1)).toBe("0.01");
    expect(centsToDollars(99)).toBe("0.99");
    expect(centsToDollars(123456)).toBe("1234.56");
  });

  it("returns empty string for undefined", () => {
    expect(centsToDollars(undefined)).toBe("");
  });

  it("returns empty string for null", () => {
    expect(centsToDollars(null)).toBe("");
  });

  it("handles large values", () => {
    expect(centsToDollars(999999)).toBe("9999.99");
  });
});

describe("dollarsToCents", () => {
  it("converts dollar string to cents", () => {
    expect(dollarsToCents("25.00")).toBe(2500);
    expect(dollarsToCents("1.00")).toBe(100);
    expect(dollarsToCents("0.01")).toBe(1);
    expect(dollarsToCents("0.99")).toBe(99);
  });

  it("returns undefined for empty string", () => {
    expect(dollarsToCents("")).toBeUndefined();
  });

  it("returns undefined for whitespace-only string", () => {
    expect(dollarsToCents("   ")).toBeUndefined();
  });

  it("returns undefined for non-numeric string", () => {
    expect(dollarsToCents("abc")).toBeUndefined();
    expect(dollarsToCents("$25.00")).toBeUndefined();
  });

  it("rounds to nearest cent to avoid floating point issues", () => {
    expect(dollarsToCents("19.99")).toBe(1999);
    expect(dollarsToCents("0.1")).toBe(10);
    expect(dollarsToCents("0.10")).toBe(10);
  });

  it("handles integer dollar values", () => {
    expect(dollarsToCents("25")).toBe(2500);
    expect(dollarsToCents("0")).toBe(0);
  });

  it("trims whitespace before parsing", () => {
    expect(dollarsToCents("  25.00  ")).toBe(2500);
  });
});

describe("formatPrice", () => {
  it("formats cents with dollar sign", () => {
    expect(formatPrice(2500)).toBe("$25.00");
    expect(formatPrice(100)).toBe("$1.00");
    expect(formatPrice(1)).toBe("$0.01");
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("sanitizePriceInput", () => {
  it("allows empty string", () => {
    expect(sanitizePriceInput("")).toBe("");
  });

  it("allows valid integer input", () => {
    expect(sanitizePriceInput("25")).toBe("25");
    expect(sanitizePriceInput("0")).toBe("0");
  });

  it("allows valid decimal input", () => {
    expect(sanitizePriceInput("25.00")).toBe("25.00");
    expect(sanitizePriceInput("25.0")).toBe("25.0");
    expect(sanitizePriceInput("25.")).toBe("25.");
    expect(sanitizePriceInput(".99")).toBe(".99");
  });

  it("rejects more than 2 decimal places", () => {
    expect(sanitizePriceInput("25.001")).toBeNull();
    expect(sanitizePriceInput("25.123")).toBeNull();
  });

  it("rejects non-numeric input", () => {
    expect(sanitizePriceInput("abc")).toBeNull();
    expect(sanitizePriceInput("$25")).toBeNull();
    expect(sanitizePriceInput("25,00")).toBeNull();
  });

  it("rejects multiple decimal points", () => {
    expect(sanitizePriceInput("25.00.00")).toBeNull();
  });

  it("rejects negative numbers", () => {
    expect(sanitizePriceInput("-25")).toBeNull();
  });
});
