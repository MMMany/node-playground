from docxtpl import DocxTemplate
import os
from pathlib import Path
from docx import Document
import re

template_path = Path(os.path.join(os.getcwd(), "templates/sample-docxtpl-tpl.docx"))
template_output = Path(os.path.join(os.getcwd(), "output/sample-docxtpl-output.docx"))
output_path = Path(os.path.join(os.getcwd(), "output/sample-pydocx-output.docx"))

template = DocxTemplate(template_path)

data = {
    "table_a": {
        "type_a": [
            {"name": "james", "cost": 1, "category": "T1"},
            {"name": "peter", "cost": 2, "category": "T1"},
            {"name": "john", "cost": 3, "category": "T2"},
        ],
        "type_b": [
            {"name": "cole", "cost": 10, "category": "T1"},
            {"name": "jack", "cost": 100, "category": "T2"},
        ],
    },
    "table_b": {
        "merged_cols": [0, 2],
        "items": [
            {"name": "james", "cost": 1, "category": "T1", "type": "A"},
            {"name": "peter", "cost": 2, "category": "T1", "type": "A"},
            {"name": "john", "cost": 3, "category": "T2", "type": "A"},
            {"name": "cole", "cost": 10, "category": "T1", "type": "B"},
            {"name": "jack", "cost": 100, "category": "T2", "type": "B"},
        ],
    },
}

template.render(data)
template.save(template_output)

docx = Document(template_output)


def get_bookmarked_tables(doc):
    xml = doc._element.xml
    pattern = r'<w:bookmarkStart w:id="[0-9]+" w:name="([^"]+)"'
    bookmarks = re.findall(pattern, xml)
    print("bookmarks :", bookmarks)
    result = {}
    for table in doc.tables:
        table_xml = table._element.xml
        for name in bookmarks:
            if table_xml.find(name) > 0:
                result[name] = table
                break
    return result


tables = get_bookmarked_tables(docx)
table = None
target_table = "table_b"
if target_table in tables:
    table = tables[target_table]

if table and target_table in data.keys():
    print("found table")
    # target_cols = [0, 1]
    target_cols = data[target_table]["merged_cols"]
    category_col = 1
    current_category = None
    start_row = None

    for col_idx in target_cols:
        for i in range(1, len(table.rows)):
            cell_value = table.cell(i, col_idx).text.strip()

            if cell_value != current_category:
                if start_row is not None and i > start_row + 1:
                    for row_idx in range(start_row + 1, i):
                        cell = table.cell(row_idx, col_idx)
                        for paragraph in cell.paragraphs:
                            paragraph.clear()

                    table.cell(start_row, col_idx).merge(table.cell(i - 1, col_idx))

                current_category = cell_value
                start_row = i

        if start_row is not None and start_row < len(table.rows) - 1:
            for row_idx in range(start_row + 1, len(table.rows)):
                cell = table.cell(row_idx, col_idx)
                for paragraph in cell.paragraphs:
                    paragraph.clear()

            table.cell(start_row, col_idx).merge(
                table.cell(len(table.rows) - 1, col_idx)
            )

docx.save(output_path)
