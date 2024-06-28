import { faker } from '@faker-js/faker';
import fs from "fs";

function createRandomPresentation()  {
    return {
      _id: faker.string.uuid(),
      avatar: faker.image.avatar(),
   
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      tag: faker.helpers.arrayElement(['soft-skills', 'technical', 'workshop']),
      name: faker.company.buzzPhrase()
    };
  }

  const presentations = []
for (let x = 0; x<=10; x++) {
    presentations.push(createRandomPresentation())
    fs.writeFileSync('../db/presentations.json', JSON.stringify(presentations))
}

