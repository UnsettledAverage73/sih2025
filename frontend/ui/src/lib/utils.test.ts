import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe('cn', () => {
  it('should combine class names correctly', () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it('should handle conditional classes', () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2");
  });

  it('should handle arrays of classes', () => {
    expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
  });

  it('should merge Tailwind CSS classes correctly', () => {
    expect(cn("px-4 py-2", "p-5")).toBe("p-5");
  });

  it('should return empty string if no classes are provided', () => {
    expect(cn()).toBe("");
  });
});
