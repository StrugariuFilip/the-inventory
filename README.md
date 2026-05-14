# 📦 THE INVENTORY | Full-Stack Management System

**🔗 Live Demo:** https://fermo.top/The-inventory/  
**Realizat de:** Strugariu Filip-Daniel

---

## 🎯 Obiectivul Proiectului

**The Inventory** este un sistem complet de gestionare a stocurilor (Full-Stack), conceput pentru a monitoriza fluxurile de marfă între furnizori și depozite în timp real. Proiectul implementează o arhitectură modernă cu un backend robust (**FastAPI**) și o interfață responsivă (**React**).

Proiectul a fost inspirat de platforma [ASSIST Learning](https://learning.assist.ro/) și adaptat cu un design modern și futurist.

---

## 🌐 Arhitectură de Producție (Live Stack)

- **Frontend Hosting:** Hostinger (Build static optimizat pe subfolder)
- **Backend API:** Render (Serviciu web FastAPI)
- **Bază de Date Live:** Supabase (Instanță cloud PostgreSQL)

---

## 🛠️ Stiva Tehnologică

### **Frontend**

- **React.js:** Interfață dinamică și modulară.
- **Tailwind CSS:** Design modern, responsiv și "mobile-first".
- **Lucide Icons:** Sistem de iconițe vectoriale.

### **Backend**

- **FastAPI (Python):** Microserviciu de înaltă performanță.
- **PostgreSQL:** Bază de date relațională pentru integritate tranzacțională.
- **SQLAlchemy:** ORM pentru modelarea datelor.
- **Pydantic:** Validarea strictă a schemelor de date.

---

## 🚀 Funcționalități Cheie

- **Warehouse Management:** Control total asupra locațiilor de depozitare și capacității acestora.
- **Supplier Directory:** Evidența furnizorilor și a contactelor unice.
- **Stock Control:** Vizualizarea stocurilor în timp real cu logica de Transfer, Increase și Decrease.
- **Mobile Responsive:** Interfață optimizată pentru utilizare pe orice dispozitiv (telefon, tabletă, desktop).
- **Interactive API Docs:** Documentație Swagger completă pentru testarea rutelor pe local.

---

## 💻 Instalare și Pornire (Local)

### **1. Backend (FastAPI)**

```bash
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload
```

👉 **Swagger UI:** http://127.0.0.1:8000/docs

### **2. Frontend (React)**

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Arhitectură Sistem

Sistemul gestionează relații complexe între:

- **Products:** Produse cu coduri SKU unice și detalii de preț.
- **Warehouses:** Locații fizice cu monitorizare de capacitate.
- **Stocks:** Legătura directă între produs și depozit.
- **Inventory Movements:** Log-uri securizate pentru orice transfer sau ajustare de stoc.

---

## 🔗 Link-uri Utile

- **Portofoliu:** https://fermo.top/cv/
- **GitHub Profile:** https://github.com/StrugariuFilip

---
