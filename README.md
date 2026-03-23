# 🌀 Sudarshan

### *Monitor. Analyze. Act.*

A **campaign intelligence dashboard** designed to provide real-time visibility into field operations, voter outreach, and political activity.

Sudarshan simulates a **war-room decision system**, enabling campaign teams to monitor performance, analyze trends, and act on strategic insights using structured data.

---

# ⚡ Quick Start

Clone the repository:

```bash
git clone https://github.com/RishaanVats/Sudarshan.git
cd sudarshan
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
ng serve
```

Open:

```
http://localhost:4200
```

---

# 🏗️ System Overview

Sudarshan is designed as a **frontend analytics system** powered by a mock API.

```
Angular Frontend (Dashboard UI)
              │
              │ HTTP (REST)
              ▼
       Mock API (json-server)
              │
              ▼
           db.json
              │
              ▼
      generateData.js
```

---

# 🎯 Project Objective

Modern political campaigns rely on centralized dashboards to track:

* volunteer deployment
* booth-level performance
* voter outreach
* sentiment trends
* opposition activity

Sudarshan provides a **simulated environment** for building and testing such systems using realistic campaign datasets.

---

# 🚀 Key Features

✔ Real-time campaign monitoring interface
✔ Modular dashboard architecture
✔ Data-driven UI with charts and tables
✔ Multi-domain campaign intelligence (volunteers, booths, sentiment, etc.)
✔ Built with modern Angular (v21, standalone components)
✔ Designed for scalability and extensibility

---

# 📊 Core Modules

### 🧭 Campaign Overview

* KPI cards (volunteers, outreach, sentiment)
* Trend charts
* Alerts panel

### 👥 Volunteer Operations

* Volunteer management
* Attendance tracking
* Field activity monitoring

### 🗳️ Booth Performance

* Booth-wise analytics
* Progress tracking
* Weak booth detection

### 🧠 Political Intelligence

* Influencer tracking
* Opposition activity monitoring
* Manager reports

### 📈 Analytics & Insights

* Sentiment distribution
* Outreach trends
* Campaign performance metrics

---

# 📁 Project Structure

```text
src/app
 ├── core
 │     ├── services
 │     └── models
 │
 ├── layout
 │     ├── sidebar
 │     ├── header
 │     └── layout.component
 │
 ├── shared
 │     ├── components
 │     │     ├── card
 │     │     ├── table
 │     │     ├── chart
 │     │     └── filter
 │
 ├── features
 │     ├── dashboard
 │     ├── volunteers
 │     ├── booths
 │     └── intelligence
```

---

# 🧠 Data Flow

```
Mock API → Angular Services → RxJS → Components → UI
```

---

# 🔌 API Integration

The frontend connects to a mock API (json-server):

Example:

```typescript
this.http.get('http://localhost:3000/volunteers');
```

---

# 🖥️ Development

Run development server:

```bash
ng serve
```

Generate components:

```bash
ng generate component component-name
```

Build project:

```bash
ng build
```

---

# 🧪 Testing

Run unit tests:

```bash
ng test
```

End-to-end testing can be configured as needed.

---

# 🎨 Design Philosophy

Sudarshan follows a **decision-driven UI approach**:

* **Monitor** → real-time KPIs and alerts
* **Analyze** → charts and trends
* **Act** → highlight critical insights

The UI emphasizes:

* clarity
* speed
* actionable intelligence

---

# 👨‍💻 Author

**Rishu Mishra**

Electronics Engineer — VIT Vellore
Former Web Developer (~3 years experience)
UPSC aspirant

This project combines **technical expertise with insights from grassroots political campaign operations**.

---

# ⚠ Disclaimer

This project is intended for **educational and portfolio purposes only**.

All data used is **synthetic and does not represent real individuals or voters**.

---

# 📜 License

MIT License

---

# 🔮 Future Enhancements

* real-time data integration
* geospatial booth analytics
* predictive modeling
* AI-driven insights
* social media sentiment tracking

---

# Final Note

Sudarshan demonstrates how structured data and modern frontend architecture can power **campaign intelligence systems and decision-support dashboards**.
