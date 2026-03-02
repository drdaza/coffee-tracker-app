import { buildDto, FieldConfig } from "@/utils/buildDto";

interface TestForm {
  name: string;
  price: string;
  description: string;
}

interface TestDto {
  name: string;
  priceInCents: number;
  description: string;
}

const fields: FieldConfig<TestForm, TestDto>[] = [
  { key: "name" },
  { key: "price", dtoKey: "priceInCents", transform: (v) => Number(v) * 100 },
  { key: "description" },
];

describe("buildDto", () => {
  describe("create mode (original is null)", () => {
    it("includes all fields when creating", () => {
      const form: TestForm = {
        name: "Espresso",
        price: "25.00",
        description: "Rich and bold",
      };

      const result = buildDto(form, null, fields);

      expect(result).toEqual({
        name: "Espresso",
        priceInCents: 2500,
        description: "Rich and bold",
      });
    });

    it("applies transforms on create", () => {
      const form: TestForm = { name: "Latte", price: "4.50", description: "" };
      const result = buildDto(form, null, fields);

      expect(result).toEqual({
        name: "Latte",
        priceInCents: 450,
        description: "",
      });
    });
  });

  describe("update mode (original provided)", () => {
    const original: TestForm = {
      name: "Espresso",
      price: "25.00",
      description: "Rich and bold",
    };

    it("returns null when nothing changed", () => {
      const result = buildDto(original, original, fields);
      expect(result).toBeNull();
    });

    it("includes only changed fields", () => {
      const updated: TestForm = {
        name: "Updated Espresso",
        price: "25.00",
        description: "Rich and bold",
      };

      const result = buildDto(updated, original, fields);

      expect(result).toEqual({ name: "Updated Espresso" });
    });

    it("includes multiple changed fields", () => {
      const updated: TestForm = {
        name: "Updated Espresso",
        price: "30.00",
        description: "Rich and bold",
      };

      const result = buildDto(updated, original, fields);

      expect(result).toEqual({
        name: "Updated Espresso",
        priceInCents: 3000,
      });
    });

    it("applies transforms only on changed fields", () => {
      const updated: TestForm = {
        name: "Espresso",
        price: "30.00",
        description: "Rich and bold",
      };

      const result = buildDto(updated, original, fields);

      expect(result).toEqual({ priceInCents: 3000 });
    });

    it("uses dtoKey for renamed fields", () => {
      const updated: TestForm = {
        name: "Espresso",
        price: "99.99",
        description: "Rich and bold",
      };

      const result = buildDto(updated, original, fields);

      expect(result).toHaveProperty("priceInCents");
      expect(result).not.toHaveProperty("price");
    });
  });

  describe("edge cases", () => {
    it("handles empty fields array", () => {
      const form: TestForm = {
        name: "Espresso",
        price: "25.00",
        description: "",
      };
      const result = buildDto(form, null, []);
      // No fields => no changes detected on create, but hasChanges starts as true for null original
      expect(result).toEqual({});
    });

    it("handles fields without transform", () => {
      const simpleFields: FieldConfig<TestForm, TestDto>[] = [{ key: "name" }];
      const form: TestForm = {
        name: "Espresso",
        price: "25.00",
        description: "",
      };
      const result = buildDto(form, null, simpleFields);
      expect(result).toEqual({ name: "Espresso" });
    });
  });
});
