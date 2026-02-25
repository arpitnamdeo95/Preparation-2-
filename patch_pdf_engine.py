
import os
import re

file_path = r'f:\gate tracker\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Using regex to find the function block
# It starts with const generateCareerRoadmapPDF and ends with }; before const DownloadRoadmapModal
pattern = re.compile(r'const\s+generateCareerRoadmapPDF\s*=\s*\(userName\s*=\s*"Velosify User"\)\s*=>\s*\{.*?doc\.save\("velosify-career-roadmap-2026\.pdf"\);\s*\};', re.DOTALL)

new_function = """const generateCareerRoadmapPDF = (userName = "Velosify User") => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const THEME = { primary: [79, 70, 229], secondary: [147, 51, 234], accent: [6, 182, 212], dark: [15, 23, 42], light: [248, 250, 252], muted: [100, 116, 139], white: [255, 255, 255] };
            const setFill = (color) => doc.setFillColor(...color);
            const setTab = (color) => doc.setTextColor(...color);
            const drawGradientBg = () => { setFill(THEME.light); doc.rect(0, 0, 210, 297, 'F'); doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.1); for(let i=0; i<300; i+=20) { doc.line(i, 0, i, 297); doc.line(0, i, 210, i); } };
            const drawFooter = (page) => { doc.setPage(page); doc.setFontSize(8); setTab(THEME.muted); doc.text(`VELOSIFY NEURAL STUDY OS // 2026 EDITION`, 20, 285); doc.text(`PAGE ${page}`, 190, 285, { align: 'right' }); setFill(THEME.primary); doc.circle(182, 284.2, 1, 'F'); };
            const drawCard = (x, y, w, h, title) => { doc.setFillColor(226, 232, 240); doc.roundedRect(x + 1, y + 1, w, h, 3, 3, 'F'); setFill(THEME.white); doc.setDrawColor(226, 232, 240); doc.roundedRect(x, y, w, h, 3, 3, 'FD'); if (title) { doc.setFont("helvetica", "bold"); doc.setFontSize(10); setTab(THEME.dark); doc.text(title.toUpperCase(), x + 8, y + 10); setFill(THEME.accent); doc.rect(x + 8, y + 12, 10, 0.5, 'F'); } };

            setFill(THEME.dark); doc.rect(0, 0, 210, 297, 'F');
            doc.setDrawColor(...THEME.primary); doc.setLineWidth(0.5); doc.line(0, 0, 210, 150); doc.line(210, 0, 0, 297);
            doc.setDrawColor(...THEME.accent); doc.setLineWidth(2); doc.circle(105, 80, 15); doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("V", 101.5, 87);
            doc.setFont("helvetica", "bold"); doc.setFontSize(42); doc.text("ULTIMATE", 105, 130, { align: "center" }); doc.text("ROADMAP", 105, 148, { align: "center" });
            doc.setFontSize(14); doc.setTextColor(...THEME.accent); doc.text("FROM BEGINNER TO INDUSTRY-READY", 105, 160, { align: "center" });
            setFill(THEME.primary); doc.rect(40, 200, 130, 45, 'F'); doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.text("PERSONALIZED PREPARATION FOR:", 105, 215, { align: "center" });
            doc.setFontSize(18); doc.text(userName.toUpperCase(), 105, 230, { align: "center" });

            doc.addPage(); drawGradientBg(); doc.setFontSize(24); setTab(THEME.dark); doc.text("HOW TO USE THIS GUIDE", 20, 40);
            const steps = [{ t: "1. UNDERSTAND THE PYRAMID", d: "Identify where you stand in terms of skills vs. market demand." }, { t: "2. EXECUTE THE TIMELINE", d: "Follow the month-by-month breakdown strictly. Foundations first." }, { t: "3. BUILD THE PORTFOLIO", d: "Projects are your real proof. Build while you learn." }];
            steps.forEach((s, i) => { drawCard(20, 60 + (i * 45), 170, 35); doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(s.t, 30, 75 + (i * 45)); doc.setFont("helvetica", "normal"); doc.setFontSize(10); setTab(THEME.muted); doc.text(s.d, 30, 82 + (i * 45), { maxWidth: 150 }); });

            doc.addPage(); drawGradientBg(); doc.setFontSize(24); setTab(THEME.dark); doc.text("CAREER SKILL PYRAMID", 20, 40);
            const levels = [{ l: "EXPERT ARCHITECT", c: THEME.secondary, p: "$200k+" }, { l: "SPECIALIZED ENGINEER", c: THEME.primary, p: "$120k+" }, { l: "CORE DEVELOPER", c: THEME.accent, p: "$70k+" }, { l: "FUNDAMENTALS", c: [71, 85, 105], p: "ENTRY" }];
            levels.forEach((lvl, i) => { const baseWidth = (i + 1) * 40; const h = 30; const y = 80 + (i * h); setFill(lvl.c); doc.triangle(105 - baseWidth/2, y + h, 105 + baseWidth/2, y + h, 105, 80, 'F'); doc.setTextColor(255, 255, 255); doc.text(lvl.l, 105, y+h-5, { align: "center" }); setTab(lvl.c); doc.text(lvl.p, 105+baseWidth/2+5, y+h-5); });

            doc.addPage(); drawGradientBg(); setTab(THEME.primary); doc.text("01. THE BEGINNER TRACK", 20, 30);
            doc.setDrawColor(...THEME.primary); doc.line(30, 60, 30, 240);
            const begSteps = [{ m: "Month 1", t: "Harvard CS50 Foundation", items: ["C Language", "Big O Complexity"] }, { m: "Month 2", t: "Python & Data Science", items: ["Data Structures", "API Basics"] }, { m: "Month 3", t: "Web & Git Essentials", items: ["HTML/CSS", "Version Control"] }];
            begSteps.forEach((s, i) => { setFill(THEME.white); doc.circle(30, 70+(i*60), 3, 'FD'); drawCard(40, 60+(i*60), 150, 45, s.m); doc.text(s.t, 50, 78+(i*60)); setTab(THEME.muted); s.items.forEach((item, idx) => doc.text("• "+item, 55, 88+(i*60)+(idx*6))); });

            doc.addPage(); drawGradientBg(); setTab(THEME.primary); doc.text("02. INTERMEDIATE SURGE", 20, 30);
            drawCard(20, 50, 170, 60, "PROJECT MILESTONES"); doc.text("BUILD 3 CORE PROJECTS:", 30, 68);
            ["1. Chat App", "2. Finance Tracker", "3. Data Dashboard"].forEach((p, idx) => doc.text(p, 35, 78+(idx*8)));
            drawCard(20, 120, 170, 80, "TECH STACK FOCUS");
            [{ n: "DATABASE", v: "MongoDB/PostgreSQL" }, { n: "BACKEND", v: "Node/Django" }, { n: "FRONTEND", v: "React/Next" }].forEach((st, i) => { setFill(THEME.primary); doc.rect(30, 140+(i*15), 5, 5, 'F'); doc.text(st.n, 40, 144+(i*15)); setTab(THEME.primary); doc.text(st.v, 100, 144+(i*15)); setTab(THEME.dark); });

            doc.addPage(); drawGradientBg(); setTab(THEME.secondary); doc.text("03. ELITE & PLACEMENT", 20, 30);
            drawCard(20, 50, 170, 100, "INTERVIEW PREP ENGINE");
            ["1. LEETCODE TOP 150", "2. SYSTEM DESIGN", "3. MOCK INTERVIEWS"].forEach((p, i) => { setFill(THEME.secondary); doc.rect(30, 70+(i*20), 150, 12, 'F'); doc.setTextColor(255,255,255); doc.text(p, 35, 78+(i*20)); });

            doc.addPage(); drawGradientBg(); setTab(THEME.accent); doc.text("SALES & MARKETING FUNNEL", 20, 30);
            [{ l: "OPTIMIZE" }, { l: "CONVERT" }, { l: "ENGAGE" }, { l: "ATTRACT" }].forEach((f, i) => { setFill(THEME.accent); doc.rect(20+(i*10), 60+(i*25), 170-(i*20), 20, 'F'); doc.setTextColor(255,255,255); doc.text(f.l, 105, 72+(i*25), { align: "center" }); });

            doc.addPage(); drawGradientBg(); setTab(THEME.secondary); doc.text("GATE 2026 STRATEGY", 20, 30);
            const gate = [{ m: "M1-2", t: "Maths & foundations" }, { m: "M3-4", t: "Core Systems" }, { m: "M5", t: "PYQ Refinement" }, { m: "M6", t: "Mock Domination" }];
            gate.forEach((g, i) => { drawCard(20+(i%2)*85, 60+Math.floor(i/2)*60, 80, 50, g.m); doc.text(g.t, 25+(i%2)*85, 80+Math.floor(i/2)*60); });

            doc.addPage(); drawGradientBg(); setTab(THEME.primary); doc.text("CORE ENGINEERING PATHS", 20, 30);
            ["MECHANICAL", "CIVIL", "ELECTRICAL", "ECE"].forEach((b, i) => { drawCard(20, 50+(i*45), 170, 35, b); });

            doc.addPage(); drawGradientBg(); setTab(THEME.dark); doc.text("RESOURCE GRID", 20, 30);
            [{ c: "BOOKS", r: ["Atomic Habits"] }, { c: "PLATFORMS", r: ["NPTEL", "LeetCode"] }, { c: "TOOLS", r: ["VS Code", "Docker"] }].forEach((res, i) => { drawCard(20+(i*60), 50, 50, 60, res.c); res.r.forEach((r, idx) => doc.text("• "+r, 25+(i*60), 75+(idx*8))); });

            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) drawFooter(i);
            doc.save(`Velosify_Career_Roadmap_2026_${userName.replace(/\\s+/g, '_')}.pdf`);
        };"""

if pattern.search(content):
    new_content = pattern.sub(new_function, content)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Success: Regex replacement complete.")
else:
    print("Error: Pattern match failed.")
