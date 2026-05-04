```javascript
// Analizador de Texto con Conteo de Palabras y Estadísticas
// Ejecutable con: node index.js

const fs = require('fs');
const readline = require('readline');

class TextAnalyzer {
  constructor(text = '') {
    this.text = text;
  }

  setText(text) {
    this.text = text;
  }

  // Contar palabras totales
  getWordCount() {
    if (!this.text.trim()) return 0;
    return this.text.trim().split(/\s+/).length;
  }

  // Contar caracteres
  getCharacterCount() {
    return this.text.length;
  }

  // Contar caracteres sin espacios
  getCharacterCountNoSpaces() {
    return this.text.replace(/\s/g, '').length;
  }

  // Contar párrafos
  getParagraphCount() {
    return this.text.split(/\n\n+/).filter(p => p.trim()).length;
  }

  // Contar oraciones
  getSentenceCount() {
    const sentences = this.text.match(/[.!?]+/g);
    return sentences ? sentences.length : 0;
  }

  // Obtener frecuencia de palabras
  getWordFrequency() {
    const words = this.text
      .toLowerCase()
      .match(/\b[a-záéíóúñ]+\b/g) || [];
    
    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }

  // Calcular promedio de palabras por oración
  getAverageWordsPerSentence() {
    const sentenceCount = this.getSentenceCount();
    if (sentenceCount === 0) return 0;
    return (this.getWordCount() / sentenceCount).toFixed(2);
  }

  // Calcular promedio de caracteres por palabra
  getAverageCharactersPerWord() {
    const wordCount = this.getWordCount();
    if (wordCount === 0) return 0;
    return (this.getCharacterCountNoSpaces() / wordCount).toFixed(2);
  }

  // Obtener palabras únicas
  getUniqueWordCount() {
    const words = this.text.toLowerCase().match(/\b[a-záéíóúñ]+\b/g) || [];
    return new Set(words).size;
  }

  // Generar reporte completo
  generateReport() {
    return {
      estadisticas_basicas: {
        total_caracteres: this.getCharacterCount(),
        total_caracteres_sin_espacios: this.getCharacterCountNoSpaces(),
        total_palabras: this.getWordCount(),
        palabras_unicas: this.getUniqueWordCount(),
        total_parrafos: this.getParagraphCount(),
        total_oraciones: this.getSentenceCount(),
      },
      promedios: {
        palabras_por_oracion: parseFloat(this.getAverageWordsPerSentence()),
        caracteres_por_palabra: parseFloat(this.getAverageCharactersPerWord()),
      },
      top_10_palabras: this.getWordFrequency(),
    };
  }

  // Imprimir reporte formateado
  printReport() {
    const report = this.generateReport();
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        ANALIZADOR DE TEXTO - REPORTE COMPLETO         ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    console.log('📊 ESTADÍSTICAS BÁSICAS:');
    console.log(`   • Total de caracteres: ${report.estadisticas_basicas.total_caracteres}`);
    console.log(`   • Total de caracteres (sin espacios): ${report.estadisticas_basicas.total_caracteres_sin_espacios}`);
    console.log(`   • Total de palabras: ${report.estadisticas_basicas.total_palabras}`);
    console.log(`   • Palabras únicas: ${report.estadisticas_basicas.palabras_unicas}`);
    console.log(`   • Total de párrafos: ${report.estadisticas_basicas.total_parrafos}`);
    console.log(`   • Total de oraciones: ${report.estadisticas_basicas.total_oraciones}\n`);

    console.log('📈 PROMEDIOS:');
    console.log(`   • Palabras por oración: ${report.promedios.palabras_por_oracion}`);
    console.log(`   • Caracteres por palabra: ${report.promedios.caracteres_por_palabra}\n`);

    console.log('🔝 TOP 10 PALABRAS MÁS FRECUENTES:');
    report.top_10_palabras.forEach((item, index) => {
      console.log(`   ${index + 1}. "${item.word}" - ${item.count} veces`);
    });
    console.log('\n');
  }
}

// Función principal interactiva
async function main() {
  const analyzer = new TextAnalyzer();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         