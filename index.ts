// Import stylesheets
import "./style.css";

import { db, Contact, Encounter } from "./database";

db.contacts.clear();
db.encounters.clear();

(async () => {
  await Contact.generateMock();
  await Contact.generateMock();
  // Write TypeScript code!
  const appDiv: HTMLElement = document.getElementById("contacts");
  await db.contacts
    .each(contact => {
      const div = document.createElement("div");
      div.innerText = `${contact.id} | ${contact.email}`;
      appDiv.appendChild(div);
    })
    .catch(e => {
      console.log(e);
    });

  (async () => {
    const contact = await db.contacts.toCollection().first();
    await db.encounters.add(
      new Encounter(contact.id, "something went down", "phone", new Date())
    );

    const appDiv: HTMLElement = document.getElementById("encounters");
    db.encounters
      .each(encounter => {
        const div = document.createElement("div");
        div.innerText = `${encounter.contactId} | ${encounter.details}`;
        appDiv.appendChild(div);
      })
      .catch(e => {
        console.log(e);
      });
  })();
})();
