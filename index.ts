// Import stylesheets
import "./style.css";

import { db, Contact } from "./database";

db.contacts.clear();

(async () => {
  await Contact.generateMock();
  await Contact.generateMock();
  // Write TypeScript code!
  const appDiv: HTMLElement = document.getElementById("contacts");
  db.contacts
    .each(contact => {
      const div = document.createElement("div");
      div.innerText = contact.email;
      appDiv.appendChild(div);
    })
    .catch(e => {
      console.log(e);
    });
})();
