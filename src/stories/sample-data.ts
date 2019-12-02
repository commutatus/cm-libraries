const faker = require('faker');

export const GenerateRandomNames = (length = 100) => {
  const names = [];
  for (let i = 1; i <= length; i++) {
    names.push({
      id: i,
      name: faker.name.firstName()
    });
  }
  return names;
};
