# 📦 The Inventory

**Realizat de:** Strugariu Filip-Daniel  
**Link Proiect:** [GitHub - The Inventory](https://github.com/StrugariuFilip/the-inventory)

---

## 🎯 Obiectivul Proiectului

În acest proiect am urmărit implementarea unui microserviciu de gestionare a inventarului care monitorizează produsele, nivelurile stocurilor, depozitele, furnizorii și mișcările de inventar.

Proiectul a fost selectat de pe platforma [ASSIST Learning](https://learning.assist.ro/) și realizat folosind tehnologii moderne pentru backend.

---

## 🛠️ Tehnologii Utilizate

Proiectul a fost dezvoltat în **VS Code** folosind următoarea stivă tehnologică:

- **Controlul versiunilor:** GitHub
- **Framework Backend:** FastAPI (Python)
- **Baza de date:** PostgreSQL
- **ORM:** SQLAlchemy (pentru modelarea bazei de date)
- **Server ASGI:** Uvicorn

---

## 🚀 Instrucțiuni de Pornire

Pentru a porni serverul și a vedea interfața de administrare, rulează următoarele comenzi în terminalul VS Code:

1. **Activarea mediului virtual:**
   .\.venv\Scripts\activate

2. **Pornirea serverului local:**
   uvicorn app.main:app --reload

3. **Vizualizarea documentației API (Swagger UI):**
   După pornire, accesează link-ul de mai jos pentru a vedea și testa toate rutele:
   👉 http://127.0.0.1:8000/docs

---

## 📊 Structura Bazei de Date

Sistemul utilizează PostgreSQL pentru stocarea datelor, gestionând relațiile între:

- **Products:** Produse cu SKU unic și detalii de preț.
- **Warehouses:** Locațiile fizice de depozitare.
- **Stocks:** Cantitățile de produse per depozit.
- **Suppliers:** Furnizorii care asigură stocul produselor.
- **Inventory Movements:** Logica de transfer, creștere sau scădere a stocului.
