import naturalCompare  from "./natural_compare";

describe('naturalCompare', function() {

  it('compares "Lesson 9" and "Lesson 10" correctly', () => {
    expect(naturalCompare("Lesson 9", "Lesson 10")).toBe(-1);
    expect(naturalCompare("Lesson 10", "Lesson 9")).toBe(1);
  });
});
