
import os
import re

filepath = r'f:\gate tracker\index.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Try a very simple literal search first
start_marker = "// PDF_START_MARKER"
end_marker = "// PDF_END_MARKER"

if start_marker in content and end_marker in content:
    print("Found literal markers!")
    start_index = content.find(start_marker)
    # Move back to start of line if possible
    while start_index > 0 and content[start_index-1] in [' ', '\t']:
        start_index -= 1
        
    end_index = content.find(end_marker) + len(end_marker)
    
    new_function = """        // PDF_START_MARKER
        const generateCareerRoadmapPDF = (userName = "Velosify User") => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');
            const THEME = {
                primary: [79, 70, 229],
                secondary: [147, 51, 234],
                accent: [6, 182, 212],
                dark: [15, 23, 42],
                light: [248, 250, 252],
                muted: [100, 116, 139],
                white: [255, 255, 255],
                black: [10, 10, 15],
                danger: [239, 68, 68]
            };

            const setFill = (color) => doc.setFillColor(...color);
            const setTab = (color) => doc.setTextColor(...color);
            const setDraw = (color) => doc.setDrawColor(...color);

            const drawFooter = (page, total) => {
                doc.setPage(page);
                doc.setFontSize(8);
                setTab(THEME.muted);
                doc.text(`VELOSIFY ULTIMATE CAREER BLUEPRINT 2026 // PAGE ${page} OF ${total}`, 20, 285);
            };

            const drawHeader = (title) => {
                setFill(THEME.dark); doc.rect(0, 0, 210, 25, 'F');
                doc.setFontSize(10); setTab(THEME.white); doc.text(title.toUpperCase(), 20, 15);
            };

            const drawCard = (x, y, w, h, title) => {
                setFill(THEME.white); setDraw([226, 232, 240]); doc.roundedRect(x, y, w, h, 2, 2, 'FD');
                if (title) { doc.setFontSize(11); setTab(THEME.dark); doc.text(title, x + 8, y + 10); }
            };

            const writeParagraph = (text, x, y, width) => {
                doc.setFontSize(10); setTab(THEME.dark);
                const lines = doc.splitTextToSize(text, width);
                doc.text(lines, x, y);
                return y + (lines.length * 5) + 5;
            };

            // COVER
            setFill(THEME.black); doc.rect(0, 0, 210, 297, 'F');
            setTab(THEME.white); doc.setFontSize(38); doc.text("ULTIMATE CAREER", 105, 130, { align: "center" });
            doc.setTextColor(...THEME.primary); doc.text("BLUEPRINT 2026", 105, 148, { align: "center" });

            // RESOURCES (10 PAGES)
            const res = ["Elite Paid Accelerators", "The Free Mastery Archive"];
            res.forEach(r => {
                for(let i=0; i<5; i++) {
                    doc.addPage(); drawHeader(r + " // TIER " + (i+1));
                    for(let j=0; j<6; j++) drawCard(20, 50 + (j*35), 170, 30, "Strategic Resource " + (j+1));
                }
            });

            // TECH TRACKS (30 PAGES)
            const tracks = ["Low-Level Optimization", "Distributed Systems", "AI Engineering", "Cloud Infrastructure", "Cyber Security", "Web Intelligence"];
            tracks.forEach(t => {
                for(let p=1; p<=5; p++){
                    doc.addPage(); drawHeader("Technical Track: " + t);
                    writeParagraph("Advanced deep-dive into " + t + " architecture and failure modes.", 20, 50, 170);
                    for(let k=0; k<5; k++) drawCard(20, 80 + (k*35), 170, 30, "Milestone " + p + "." + (k+1));
                }
            });

            // GATE (20 PAGES)
            const gate = ["Math", "OS", "DBMS", "CN", "TOC", "Compiler", "Digital", "COA"];
            gate.forEach(g => {
                for(let p=1; p<=3; p++){
                    doc.addPage(); drawHeader("GATE Strategy: " + g);
                    for(let r=0; r<6; r++) drawCard(20, 50 + (r*35), 170, 30, "Problem Set " + (r+1));
                }
            });

            // CORE (5 PAGES)
            const core = ["Mech", "Civil", "Elec", "ECE"];
            core.forEach(b => {
                doc.addPage(); drawHeader("Core Eng: " + b);
                drawCard(20, 50, 170, 80, b + " Industry 4.0 Toolkit");
            });

            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) drawFooter(i, totalPages);
            doc.save(`Velosify_ULTRA_Roadmap_2026.pdf`);
        };
        // PDF_END_MARKER"""

    new_content = content[:start_index] + new_function + content[end_index:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESSFULLY REPLACED ROADMAP!")
else:
    print("MARKERS NOT FOUND!")
