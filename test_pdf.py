from fpdf import FPDF
try:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Test PDF", ln=True, align='C')
    pdf.output("test_simple.pdf")
    print("Simple PDF success")
except Exception as e:
    print(f"Error: {e}")
