// server.js
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Walidacja danych
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
  return /^[0-9]{9}$/.test(phone);
}
function validatePesel(pesel) {
  return /^[0-9]{11}$/.test(pesel);
}

app.post("/api/appointments", (req, res) => {
  const {
    id: pesel,
    name,
    surname,
    email,
    telephone: phone,
    doctor: doctorId,
    appointmentDate: date,
    appointmentTime: time,
  } = req.body;

  // 1) Walidacja obecności pól
  if (
    !pesel ||
    !name ||
    !surname ||
    !email ||
    !phone ||
    !doctorId ||
    !date ||
    !time
  ) {
    return res.status(400).json({ error: "Wszystkie pola są wymagane." });
  }
  // 2) Walidacja formatów
  if (!validatePesel(pesel))
    return res.status(400).json({ error: "Niepoprawny PESEL." });
  if (!validateEmail(email))
    return res.status(400).json({ error: "Niepoprawny e-mail." });
  if (!validatePhone(phone))
    return res.status(400).json({ error: "Niepoprawny telefon." });

  // 3) Ścieżka do pliku z rezerwacjami
  const filePath = path.join(__dirname, "public", "data", "appointments.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:\n", err);
      return res.status(500).json({ error: "Error reading file" });
    }

    let appointments = [];
    try {
      appointments = data ? JSON.parse(data) : [];
    } catch (parseErr) {
      console.error("Parse error:\n", parseErr);
      return res.status(500).json({ error: "Error parsing file" });
    }

    // 4) Sprawdzenie dostępności terminu
    const isTaken = appointments.some(
      (a) =>
        a.doctor === doctorId &&
        a.appointmentDate === date &&
        a.appointmentTime === time
    );
    if (isTaken) {
      return res.status(400).json({ error: "Termin zajęty." });
    }

    // 5) Dodanie nowej rezerwacji
    const newAppt = {
      pesel,
      name,
      surname,
      email,
      phone,
      doctor: doctorId,
      appointmentDate: date,
      appointmentTime: time,
    };
    appointments.push(newAppt);

    fs.writeFile(filePath, JSON.stringify(appointments, null, 2), (err) => {
      if (err) {
        console.error("Write error:\n", err);
        return res.status(500).json({ error: "Error writing file" });
      }
      res.json({ message: "Rezerwacja zapisana pomyślnie." });
    });
  });
});

// Opcjonalnie: obsługa favicon żeby uniknąć 404
app.get("/favicon.svg", (req, res) => res.sendStatus(204));

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
