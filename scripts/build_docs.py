import os
import sys
import re
import html
import zipfile
from fpdf import FPDF

# ==============================================================================
# PART 1: OPENDOCX GENERATOR (Pure Python OpenXML)
# ==============================================================================

class DocxGenerator:
    def __init__(self, title, subtitle):
        self.title = title
        self.subtitle = subtitle
        self.body_xml = []
        self._add_title_block()

    def escape(self, text):
        return html.escape(str(text))

    def _add_title_block(self):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="600" w:after="160"/>
            <w:jc w:val="center"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="52"/>
              <w:color w:val="0A192F"/>
            </w:rPr>
            <w:t>{self.escape(self.title)}</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:spacing w:before="0" w:after="280"/>
            <w:jc w:val="center"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:sz w:val="28"/>
              <w:color w:val="0284C7"/>
              <w:i/>
            </w:rPr>
            <w:t>{self.escape(self.subtitle)}</w:t>
          </w:r>
        </w:p>
        <w:p>
          <w:pPr>
            <w:pBdr><w:bottom w:val="single" w:sz="24" w:space="24" w:color="0284C7"/></w:pBdr>
            <w:spacing w:before="120" w:after="480"/>
            <w:jc w:val="center"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:sz w:val="22"/>
              <w:color w:val="64748B"/>
            </w:rPr>
            <w:t>Garden City Properties • Muscat, Sultanate of Oman • Enterprise User Manual</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_heading_1(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="400" w:after="160"/>
            <w:pBdr><w:bottom w:val="single" w:sz="18" w:space="10" w:color="0A192F"/></w:pBdr>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="34"/>
              <w:color w:val="0A192F"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_heading_2(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="280" w:after="120"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:sz w:val="28"/>
              <w:color w:val="1E3A8A"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_heading_3(self, text):
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="200" w:after="80"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:b/>
              <w:sz w:val="24"/>
              <w:color w:val="0369A1"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_paragraph(self, text, bold_prefix=None):
        prefix_xml = ""
        if bold_prefix:
            prefix_xml = f"""<w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">{self.escape(bold_prefix)} </w:t></w:r>"""
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="60" w:after="100" w:line="276" w:lineRule="auto"/>
          </w:pPr>
          {prefix_xml}
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:sz w:val="22"/>
              <w:color w:val="334155"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_bullet(self, text, bold_prefix=None):
        prefix_xml = ""
        if bold_prefix:
            prefix_xml = f"""<w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t xml:space="preserve">{self.escape(bold_prefix)}: </w:t></w:r>"""
        xml = f"""
        <w:p>
          <w:pPr>
            <w:spacing w:before="40" w:after="60"/>
            <w:ind w:left="360" w:hanging="240"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
              <w:b/>
              <w:color w:val="0284C7"/>
            </w:rPr>
            <w:t xml:space="preserve">▪  </w:t>
          </w:r>
          {prefix_xml}
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:sz w:val="21"/>
              <w:color w:val="334155"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_callout(self, title, text, style='info'):
        color = "0284C7" if style == 'info' else "D97706"
        fill = "F0F9FF" if style == 'info' else "FFFBEB"
        xml = f"""
        <w:p>
          <w:pPr>
            <w:pBdr>
              <w:left w:val="single" w:sz="36" w:space="15" w:color="{color}"/>
            </w:pBdr>
            <w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>
            <w:spacing w:before="140" w:after="140"/>
            <w:ind w:left="240" w:right="240"/>
          </w:pPr>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:b/>
              <w:color w:val="{color}"/>
              <w:sz w:val="22"/>
            </w:rPr>
            <w:t xml:space="preserve">[{self.escape(title)}] </w:t>
          </w:r>
          <w:r>
            <w:rPr>
              <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
              <w:color w:val="1E293B"/>
              <w:sz w:val="21"/>
            </w:rPr>
            <w:t>{self.escape(text)}</w:t>
          </w:r>
        </w:p>
        """
        self.body_xml.append(xml)

    def add_table(self, headers, rows):
        header_cells = ""
        for h in headers:
            header_cells += f"""
            <w:tc>
              <w:tcPr>
                <w:shd w:val="clear" w:color="auto" w:fill="0A192F"/>
                <w:tcMar><w:top w:w="140" w:type="dxa"/><w:bottom w:w="140" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tcMar>
              </w:tcPr>
              <w:p>
                <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
                <w:r>
                  <w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr>
                  <w:t>{self.escape(h)}</w:t>
                </w:r>
              </w:p>
            </w:tc>
            """

        rows_xml = ""
        for idx, row in enumerate(rows):
            fill = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
            cells = ""
            for c in row:
                cells += f"""
                <w:tc>
                  <w:tcPr>
                    <w:shd w:val="clear" w:color="auto" w:fill="{fill}"/>
                    <w:tcMar><w:top w:w="100" w:type="dxa"/><w:bottom w:w="100" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:right w:w="160" w:type="dxa"/></w:tcMar>
                  </w:tcPr>
                  <w:p>
                    <w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr>
                    <w:r>
                      <w:rPr><w:color w:val="334155"/><w:sz w:val="19"/></w:rPr>
                      <w:t>{self.escape(c)}</w:t>
                    </w:r>
                  </w:p>
                </w:tc>
                """
            rows_xml += f"""
            <w:tr>
              <w:trPr><w:cantSplit/></w:trPr>
              {cells}
            </w:tr>
            """

        xml = f"""
        <w:tbl>
          <w:tblPr>
            <w:tblW w:w="5000" w:type="pct"/>
            <w:tblBorders>
              <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
              <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
              <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
              <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
              <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
              <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
            </w:tblBorders>
            <w:tblLayout w:type="autofit"/>
          </w:tblPr>
          <w:tr>
            <w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>
            {header_cells}
          </w:tr>
          {rows_xml}
        </w:tbl>
        <w:p><w:pPr><w:spacing w:after="160"/></w:pPr></w:p>
        """
        self.body_xml.append(xml)

    def add_page_break(self):
        self.body_xml.append('<w:p><w:r><w:br w:type="page"/></w:r></w:p>')

    def save(self, output_path):
        content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>"""

        rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>"""

        doc_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""

        app_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Garden City Properties Admin Suite</Application>
  <Company>Garden City Properties</Company>
</Properties>"""

        core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>{self.escape(self.title)}</dc:title>
  <dc:creator>Garden City Properties Technical Team</dc:creator>
</cp:coreProperties>"""

        styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>
      <w:sz w:val="22"/>
      <w:color w:val="334155"/>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>"""

        full_doc = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    {''.join(self.body_xml)}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720"/>
    </w:sectPr>
  </w:body>
</w:document>"""

        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as z:
            z.writestr('[Content_Types].xml', content_types)
            z.writestr('_rels/.rels', rels)
            z.writestr('docProps/app.xml', app_xml)
            z.writestr('docProps/core.xml', core_xml)
            z.writestr('word/_rels/document.xml.rels', doc_rels)
            z.writestr('word/styles.xml', styles_xml)
            z.writestr('word/document.xml', full_doc)

        print(f"Generated DOCX: {output_path} ({os.path.getsize(output_path):,} bytes)")


# ==============================================================================
# PART 2: FPDF CORPORATE MANUAL GENERATOR
# ==============================================================================

class PDFManual(FPDF):
    def __init__(self, title, subtitle):
        super().__init__(orientation='P', unit='mm', format='A4')
        self.doc_title = title
        self.doc_subtitle = subtitle
        self.set_margins(15, 18, 15)
        self.set_auto_page_break(auto=True, margin=20)
        self.alias_nb_pages()

    def sanitize(self, text):
        if not text:
            return ""
        # Replace unicode characters with latin-1 equivalents for standard PDF fonts
        t = str(text)
        replacements = [
            ("—", " - "), ("–", "-"), ("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'),
            ("•", "-"), ("▪", "-"), ("★", "[Featured]"), ("✓", "[x]"), ("✔", "[x]"),
            ("●", "*"), ("…", "..."), ("®", "(R)"), ("™", "(TM)"), ("↗", "->"),
            ("⚠️", "[WARNING]:"), ("📸", "[PHOTO]"), ("📐", "[PLAN]"),
            ("²", "2"), ("³", "3"), ("\u200b", ""), ("\u200e", ""), ("\u200f", "")
        ]
        for src, dst in replacements:
            t = t.replace(src, dst)
        
        # If any non-latin1 characters remain, encode safely
        return t.encode('latin-1', 'replace').decode('latin-1')

    def header(self):
        if self.page_no() == 1:
            return # Suppress header on cover page
        self.set_font('Arial', 'B', 8)
        self.set_text_color(100, 116, 139) # Slate grey
        self.cell(0, 6, "GARDEN CITY PROPERTIES  |  ADMIN PRO DASHBOARD USER MANUAL", 0, 1, 'L')
        self.set_draw_color(2, 132, 199) # Cyan line
        self.set_line_width(0.3)
        self.line(15, 25, 195, 25)
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_draw_color(226, 232, 240)
        self.line(15, 282, 195, 282)
        self.set_font('Arial', '', 8)
        self.set_text_color(148, 163, 184)
        self.cell(100, 10, "Muscat, Sultanate of Oman  |  gardencityproperties.net", 0, 0, 'L')
        self.cell(80, 10, f"Page {self.page_no()} of {{nb}}", 0, 0, 'R')

    def add_cover_page(self):
        self.add_page()
        self.ln(25)
        
        # Top Badge
        self.set_fill_color(240, 249, 255)
        self.set_text_color(2, 132, 199)
        self.set_font('Arial', 'B', 10)
        self.cell(85, 8, "  OFFICIAL CLIENT USER MANUAL  ", 0, 1, 'L', fill=True)
        self.ln(4)
        
        # Title
        self.set_text_color(10, 25, 47) # Deep Navy
        self.set_font('Arial', 'B', 24)
        self.multi_cell(0, 11, self.sanitize(self.doc_title))
        self.ln(2)
        
        # Subtitle
        self.set_text_color(2, 132, 199) # Cyan
        self.set_font('Arial', 'I', 13)
        self.multi_cell(0, 7, self.sanitize(self.doc_subtitle))
        self.ln(4)
        
        # Cyan divider
        self.set_draw_color(2, 132, 199)
        self.set_line_width(0.8)
        self.line(15, self.get_y(), 195, self.get_y())
        self.ln(8)
        
        # Metadata Block
        self.set_fill_color(248, 250, 252)
        self.rect(15, self.get_y(), 180, 48, 'F')
        
        start_y = self.get_y() + 4
        self.set_xy(20, start_y)
        self.set_font('Arial', 'B', 9)
        self.set_text_color(15, 23, 42)
        self.cell(45, 6, "Official Production Site:", 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(110, 6, "https://www.gardencityproperties.net/", 0, 1)
        
        self.set_x(20)
        self.set_font('Arial', 'B', 9)
        self.cell(45, 6, "Administrative Portal:", 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(110, 6, "https://www.gardencityproperties.net/admin/", 0, 1)

        self.set_x(20)
        self.set_font('Arial', 'B', 9)
        self.cell(45, 6, "Direct Admin Login:", 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(110, 6, "https://www.gardencityproperties.net/admin/login/", 0, 1)

        self.set_x(20)
        self.set_font('Arial', 'B', 9)
        self.cell(45, 6, "Audience & Scope:", 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(110, 6, "Property Managers, Sales Directors & Content Administrators", 0, 1)

        self.set_x(20)
        self.set_font('Arial', 'B', 9)
        self.cell(45, 6, "Version & Date:", 0, 0)
        self.set_font('Arial', '', 9)
        self.cell(110, 6, "Version 2.4 (Enterprise Edition) - November 2026", 0, 1)
        
        self.set_y(start_y + 48 + 12)
        
        # Executive Summary Callout
        self.set_fill_color(240, 249, 255)
        self.set_draw_color(2, 132, 199)
        self.set_line_width(0.5)
        self.rect(15, self.get_y(), 180, 50, 'DF')
        
        box_y = self.get_y() + 5
        self.set_xy(20, box_y)
        self.set_font('Arial', 'B', 11)
        self.set_text_color(2, 132, 199)
        self.cell(0, 6, "EXECUTIVE OPERATIONAL BRIEF", 0, 1)
        
        self.set_xy(20, box_y + 7)
        self.set_font('Arial', '', 9)
        self.set_text_color(51, 65, 85)
        exec_text = (
            "This comprehensive operations manual empowers the Garden City Properties executive and marketing "
            "team to manage all developments on gardencityproperties.net independently. You can add new master "
            "developments, update prices in OMR, upload high-resolution cover photos and galleries, define "
            "individual unit typologies (villas, apartments, studios, penthouses) with dedicated photography, "
            "customize milestone payment schedules, configure luxury amenities, and manage Google Maps locations. "
            "All changes synchronize automatically and reflect instantly on the public website."
        )
        self.multi_cell(170, 5, self.sanitize(exec_text))
        
        self.add_page()

    def add_heading_1(self, text):
        if self.get_y() > 230:
            self.add_page()
        self.ln(6)
        self.set_font('Arial', 'B', 14)
        self.set_text_color(10, 25, 47)
        self.multi_cell(0, 7, self.sanitize(text))
        self.set_draw_color(10, 25, 47)
        self.set_line_width(0.4)
        self.line(15, self.get_y(), 195, self.get_y())
        self.ln(3)

    def add_heading_2(self, text):
        if self.get_y() > 240:
            self.add_page()
        self.ln(4)
        self.set_font('Arial', 'B', 11)
        self.set_text_color(30, 58, 138)
        self.multi_cell(0, 6, self.sanitize(text))
        self.ln(1)

    def add_heading_3(self, text):
        if self.get_y() > 245:
            self.add_page()
        self.ln(2)
        self.set_font('Arial', 'B', 9.5)
        self.set_text_color(3, 105, 161)
        self.multi_cell(0, 5, self.sanitize(text))
        self.ln(1)

    def add_paragraph(self, text, bold_prefix=None):
        if self.get_y() > 260:
            self.add_page()
        self.set_font('Arial', '', 9)
        self.set_text_color(51, 65, 85)
        if bold_prefix:
            self.set_font('Arial', 'B', 9)
            self.set_text_color(15, 23, 42)
            self.write(5, self.sanitize(bold_prefix) + " ")
            self.set_font('Arial', '', 9)
            self.set_text_color(51, 65, 85)
        self.multi_cell(0, 5, self.sanitize(text))
        self.ln(2)

    def add_bullet(self, text, bold_prefix=None):
        if self.get_y() > 260:
            self.add_page()
        self.set_x(18)
        self.set_font('Arial', 'B', 9)
        self.set_text_color(2, 132, 199)
        self.cell(4, 5, "-", 0, 0)
        if bold_prefix:
            self.set_font('Arial', 'B', 9)
            self.set_text_color(15, 23, 42)
            self.write(5, self.sanitize(bold_prefix) + ": ")
        self.set_font('Arial', '', 9)
        self.set_text_color(51, 65, 85)
        self.multi_cell(0, 5, self.sanitize(text))
        self.ln(1)

    def add_callout(self, title, text, style='info'):
        if self.get_y() > 240:
            self.add_page()
        self.ln(2)
        curr_y = self.get_y()
        # Pre-measure text height
        self.set_font('Arial', '', 8.5)
        lines = len(self.sanitize(text)) // 85 + 2
        box_h = max(18, lines * 5 + 6)
        
        fill_color = (240, 249, 255) if style == 'info' else (255, 251, 235)
        border_color = (2, 132, 199) if style == 'info' else (217, 119, 6)
        text_color = (3, 105, 161) if style == 'info' else (180, 83, 9)
        
        self.set_fill_color(*fill_color)
        self.set_draw_color(*border_color)
        self.set_line_width(0.6)
        self.rect(15, curr_y, 180, box_h, 'DF')
        
        self.set_xy(18, curr_y + 3)
        self.set_font('Arial', 'B', 9)
        self.set_text_color(*text_color)
        self.cell(0, 5, f"[{self.sanitize(title)}]", 0, 1)
        
        self.set_x(18)
        self.set_font('Arial', '', 8.5)
        self.set_text_color(30, 41, 59)
        self.multi_cell(172, 4.5, self.sanitize(text))
        self.set_y(curr_y + box_h + 3)

    def add_table(self, headers, rows):
        if self.get_y() > 220:
            self.add_page()
        self.ln(3)
        
        col_count = len(headers)
        available_w = 180
        col_w = available_w / col_count
        
        # Header Row
        self.set_fill_color(10, 25, 47)
        self.set_text_color(255, 255, 255)
        self.set_font('Arial', 'B', 8.5)
        for h in headers:
            self.cell(col_w, 7, self.sanitize(h), 1, 0, 'C', fill=True)
        self.ln()
        
        # Data Rows
        self.set_font('Arial', '', 8)
        self.set_text_color(51, 65, 85)
        for idx, row in enumerate(rows):
            if self.get_y() > 265:
                self.add_page()
            fill = (idx % 2 == 1)
            self.set_fill_color(248, 250, 252) if fill else self.set_fill_color(255, 255, 255)
            for c in row:
                self.cell(col_w, 6, self.sanitize(str(c)), 1, 0, 'L', fill=True)
            self.ln()
        self.ln(3)


# ==============================================================================
# PART 3: PARSE MARKDOWN AND COMPILE ALL FORMATS
# ==============================================================================

def compile_manual_from_markdown():
    md_path = 'documentation/Garden_City_Properties_Admin_Pro_User_Manual.md'
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found.")
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Initialize Builders
    docx = DocxGenerator(
        title="GARDEN CITY PROPERTIES\nADMIN PRO DASHBOARD — CLIENT USER MANUAL",
        subtitle="Website Content Management & Property Administration Guide"
    )
    pdf = PDFManual(
        title="GARDEN CITY PROPERTIES\nADMIN PRO DASHBOARD - USER MANUAL",
        subtitle="Website Content Management & Property Administration Guide"
    )
    pdf.add_cover_page()

    lines = md_content.split('\n')
    i = 0
    in_table = False
    table_headers = []
    table_rows = []

    while i < len(lines):
        line = lines[i].strip()

        # Handle Table
        if line.startswith('|') and line.endswith('|'):
            cells = [c.strip() for c in line.split('|')[1:-1]]
            if not in_table:
                in_table = True
                table_headers = cells
                table_rows = []
                i += 1
                continue
            else:
                # Check if separator row (|---|---|)
                if all(set(c).issubset({'-', ':', ' '}) for c in cells):
                    i += 1
                    continue
                table_rows.append(cells)
                i += 1
                continue
        else:
            if in_table:
                # Flush table
                docx.add_table(table_headers, table_rows)
                pdf.add_table(table_headers, table_rows)
                in_table = False
                table_headers = []
                table_rows = []

        if not line or line.startswith('---'):
            i += 1
            continue

        # Headings
        if line.startswith('# '):
            # Title already handled in cover
            i += 1
            continue
        elif line.startswith('## PART '):
            docx.add_page_break()
            docx.add_heading_1(line.replace('## ', ''))
            pdf.add_heading_1(line.replace('## ', ''))
        elif line.startswith('## '):
            docx.add_heading_1(line.replace('## ', ''))
            pdf.add_heading_1(line.replace('## ', ''))
        elif line.startswith('### '):
            docx.add_heading_2(line.replace('### ', ''))
            pdf.add_heading_2(line.replace('### ', ''))
        elif line.startswith('#### '):
            docx.add_heading_3(line.replace('#### ', ''))
            pdf.add_heading_3(line.replace('#### ', ''))

        # Callouts / Alerts (> **Important**: ...)
        elif line.startswith('> '):
            text = line.replace('> ', '').strip()
            style = 'warning' if ('Important' in text or 'Legal' in text or 'Warning' in text or '⚠️' in text) else 'info'
            title = 'IMPORTANT NOTICE' if style == 'warning' else 'OPERATIONAL NOTE'
            docx.add_callout(title, text.replace('**', '').replace('⚠️', ''), style=style)
            pdf.add_callout(title, text.replace('**', '').replace('⚠️', ''), style=style)

        # Bullets (- or - [ ])
        elif line.startswith('- ') or line.startswith('* ') or line.startswith('- [ ] ') or line.startswith('- [x] '):
            b_text = re.sub(r'^(\-\s+|\*\s+|\-\s+\[\s*\]\s+|\-\s+\[x\]\s+)', '', line)
            bold_prefix = None
            if '**' in b_text:
                m = re.match(r'^\*\*(.*?)\*\*:?\s*(.*)', b_text)
                if m:
                    bold_prefix = m.group(1)
                    b_text = m.group(2)
            docx.add_bullet(b_text, bold_prefix=bold_prefix)
            pdf.add_bullet(b_text, bold_prefix=bold_prefix)

        # Numbered list item (1. 2. 3.)
        elif re.match(r'^\d+\.\s+', line):
            n_text = re.sub(r'^\d+\.\s+', '', line)
            bold_prefix = None
            if '**' in n_text:
                m = re.match(r'^\*\*(.*?)\*\*:?\s*(.*)', n_text)
                if m:
                    bold_prefix = m.group(1)
                    n_text = m.group(2)
            docx.add_bullet(n_text, bold_prefix=bold_prefix)
            pdf.add_bullet(n_text, bold_prefix=bold_prefix)

        # Regular Paragraph
        else:
            bold_prefix = None
            p_text = line
            if '**' in p_text and p_text.startswith('**'):
                m = re.match(r'^\*\*(.*?)\*\*:?\s*(.*)', p_text)
                if m:
                    bold_prefix = m.group(1)
                    p_text = m.group(2)
            docx.add_paragraph(p_text, bold_prefix=bold_prefix)
            pdf.add_paragraph(p_text, bold_prefix=bold_prefix)

        i += 1

    # Save Output
    docx_path = 'documentation/Garden_City_Properties_Admin_Pro_User_Manual.docx'
    pdf_path = 'documentation/Garden_City_Properties_Admin_Pro_User_Manual.pdf'
    
    docx.save(docx_path)
    pdf.output(pdf_path, 'F')
    print(f"Generated PDF:  {pdf_path} ({os.path.getsize(pdf_path):,} bytes)")


def compile_quick_start():
    md_path = 'documentation/Garden_City_Properties_Quick_Start_Guide.md'
    if not os.path.exists(md_path):
        return

    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    docx = DocxGenerator(
        title="GARDEN CITY PROPERTIES — ADMIN PRO",
        subtitle="1-Page Executive Quick Start Guide"
    )
    pdf = PDFManual(
        title="GARDEN CITY PROPERTIES - ADMIN PRO",
        subtitle="1-Page Executive Quick Start Guide"
    )
    pdf.add_page()
    pdf.set_text_color(10, 25, 47)
    pdf.set_font('Arial', 'B', 18)
    pdf.cell(0, 10, "GARDEN CITY PROPERTIES  |  ADMIN PRO", 0, 1, 'C')
    pdf.set_text_color(2, 132, 199)
    pdf.set_font('Arial', 'I', 11)
    pdf.cell(0, 6, "1-Page Executive Quick Start Guide", 0, 1, 'C')
    pdf.set_draw_color(2, 132, 199)
    pdf.set_line_width(0.6)
    pdf.line(15, pdf.get_y() + 2, 195, pdf.get_y() + 2)
    pdf.ln(5)

    lines = md_content.split('\n')
    for line in lines:
        line = line.strip()
        if not line or line.startswith('# ') or line.startswith('## '):
            continue
        if line.startswith('### '):
            title = line.replace('### ', '')
            docx.add_heading_2(title)
            pdf.add_heading_2(title)
        elif line.startswith('- ') or line.startswith('* ') or re.match(r'^\d+\.\s+', line):
            text = re.sub(r'^(\-\s+|\*\s+|\d+\.\s+)', '', line)
            bold_prefix = None
            if '**' in text:
                m = re.match(r'^\*\*(.*?)\*\*:?\s*(.*)', text)
                if m:
                    bold_prefix = m.group(1)
                    text = m.group(2)
            docx.add_bullet(text, bold_prefix=bold_prefix)
            pdf.add_bullet(text, bold_prefix=bold_prefix)
        else:
            docx.add_paragraph(line)
            pdf.add_paragraph(line)

    docx_path = 'documentation/Garden_City_Properties_Quick_Start_Guide.docx'
    pdf_path = 'documentation/Garden_City_Properties_Quick_Start_Guide.pdf'
    
    docx.save(docx_path)
    pdf.output(pdf_path, 'F')
    print(f"Generated PDF:  {pdf_path} ({os.path.getsize(pdf_path):,} bytes)")


if __name__ == '__main__':
    print("Compiling Garden City Properties Documentation...")
    compile_manual_from_markdown()
    compile_quick_start()
    print("All documentation compiled successfully!")
