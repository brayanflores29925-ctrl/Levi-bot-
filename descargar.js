const ytDlp = require('yt-dlp-exec');

async function descargarVideo(url) {
    try {
        console.log('Iniciando la descarga...');
        
        // Descarga el video en la mejor calidad en la carpeta actual
        await ytDlp(url, {
            output: '%(title)s.%(ext)s',
            format: 'bv*+ba/b', // Mejor video + mejor audio combinados
        });

        console.log('¡Descarga completada con éxito!');
    } catch (error) {
        console.error('Error al descargar el video:', error);
    }
}

// Reemplaza con la URL que necesites
descargarVideo(')
