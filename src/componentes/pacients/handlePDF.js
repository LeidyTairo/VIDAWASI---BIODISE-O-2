import { jsPDF } from "jspdf";

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

const handleDownloadPDF = async (paciente, descripcion, setSpan, medico) => {
    if (descripcion !== "") {
        console.log("Generando PDF...");
        setSpan("");

        const pdf = new jsPDF();
        const margin = 20; 
        let y = margin; 
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height - 2 * margin; 

        try {
            for (const imagePath of paciente.imagenes) {
                // Utiliza una ruta local para las imágenes
                const imageUrl = `/images/${imagePath}`;

                // Agregar manejo de excepciones al cargar la imagen
                let image;
                try {
                    image = await loadImage(imageUrl);
                } catch (loadError) {
                    console.error(`Error al cargar la imagen ${imagePath}:`, loadError);
                    continue; // Continuar con la siguiente imagen
                }

                // Añadir la imagen al PDF
                if (y + (pageHeight / 2) > pageHeight) {
                    pdf.addPage();
                    y = margin;
                }
                pdf.addImage(image, 'PNG', margin, y, pageWidth - 2 * margin, pageHeight / 2);
                y += pageHeight / 2 + margin;
            }

            // Añadir texto y guardar PDF
            y = pageHeight - margin - 30;
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(18);
            pdf.text("Paciente: " + paciente.nombresCompletos, margin, y);
            y += 10;

            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(12);
            pdf.text("Descripción: " + descripcion, margin, y);
            y += 10;

            pdf.text("Médico: " + medico, margin, y);

            pdf.save(`${paciente.nombresCompletos}_report.pdf`);
            console.log("PDF generado y descargado.");
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            setSpan("Error al generar el PDF. Inténtelo de nuevo.");
        }
    } else {
        setSpan("Por favor ingrese una descripción.");
    }
};

export default handleDownloadPDF;
