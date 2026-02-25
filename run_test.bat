@echo off
python test_pdf.py > test_out.log 2>&1
dir test_simple.pdf >> test_out.log
