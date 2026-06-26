import os
import subprocess
import sys

def generate_pdf():
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not os.path.exists(edge_path):
        print(f"Error: No se encontró Microsoft Edge en {edge_path}")
        sys.exit(1)
        
    workspace_dir = r"c:\Antigrvity practicas\SKILLSWAP"
    html_path = os.path.join(workspace_dir, "Manual_de_Usuario_SkillSwap.html")
    pdf_path = os.path.join(workspace_dir, "Manual_de_Usuario_SkillSwap.pdf")
    
    if not os.path.exists(html_path):
        print(f"Error: No se encontró el archivo HTML en {html_path}")
        sys.exit(1)
        
    print(f"Generando PDF desde: {html_path}")
    print(f"Guardando PDF en: {pdf_path}")
    
    # Comando para Microsoft Edge Headless para imprimir a PDF sin cabeceras/pies de página del navegador
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--print-to-pdf-no-header",
        f"--print-to-pdf={pdf_path}",
        html_path
    ]
    
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=20)
        if res.returncode == 0:
            print("¡PDF generado exitosamente!")
            if os.path.exists(pdf_path):
                print(f"Tamaño del PDF: {os.path.getsize(pdf_path) / 1024:.1f} KB")
        else:
            print(f"Error al generar PDF. Código de salida: {res.returncode}")
            print(f"Stdout: {res.stdout}")
            print(f"Stderr: {res.stderr}")
    except subprocess.TimeoutExpired:
        print("Error: Se agotó el tiempo de espera al ejecutar Microsoft Edge.")
    except Exception as e:
        print(f"Ocurrió un error inesperado: {e}")

if __name__ == "__main__":
    generate_pdf()
