// src/services/pdfService.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { 
  PDFExportOptions, 
  PDFExportResult, 
  PDFGenerationConfig,
  PDFTheme
} from '../types/pdf.types';

/**
 * Serviço principal de exportação PDF
 */
export class PDFService {
  private static readonly DEFAULT_OPTIONS: PDFExportOptions = {
    format: 'A4',
    orientation: 'portrait',
    quality: 0.95,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  };

  /**
   * Exporta o currículo para PDF
   */
  static async exportToPDF(config: PDFGenerationConfig): Promise<PDFExportResult> {
    try {
      console.log('🚀 Iniciando exportação PDF...');
      
      const { element, options, cvData } = config;
      const finalOptions = { ...this.DEFAULT_OPTIONS, ...options };
      
      // Preparar elemento para captura
      const preparedElement = await this.prepareElementForCapture(element, finalOptions.theme);
      
      // Log antes da captura
      console.log('📸 INICIANDO CAPTURA COM HTML2CANVAS...');
      console.log('📸 Elemento para captura:', preparedElement);
      console.log('📸 Dimensões:', preparedElement.offsetWidth, 'x', preparedElement.offsetHeight);
      console.log('📸 ScrollWidth/Height:', preparedElement.scrollWidth, 'x', preparedElement.scrollHeight);
      
      // Capturar como imagem com configurações otimizadas
      const canvas = await html2canvas(preparedElement, {
        scale: 2, // Escala fixa para consistência
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: preparedElement.offsetWidth,
        height: preparedElement.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        ignoreElements: (element) => {
          // Ignora elementos que podem causar problemas
          return element.classList.contains('export-button') || 
                 element.tagName === 'BUTTON';
        },
        onclone: (clonedDoc) => {
          console.log('📸 CLONE CRIADO PARA CAPTURA:', clonedDoc);
          // Força estilos no documento clonado
          const clonedElements = clonedDoc.querySelectorAll('[style*="backgroundColor"]');
          console.log('📸 Elementos com background no clone:', clonedElements.length);
        }
      });
      
      console.log('📸 CAPTURA CONCLUÍDA! Canvas:', canvas.width, 'x', canvas.height);

      // Criar PDF
      const pdf = new jsPDF({
        orientation: finalOptions.orientation!,
        unit: 'mm',
        format: finalOptions.format!.toLowerCase() as 'a4' | 'letter'
      });

      // Dimensões da página PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular dimensões da imagem mantendo proporção
      const imgWidth = pageWidth - (finalOptions.margin!.left + finalOptions.margin!.right);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Adicionar imagem ao PDF
      const imgData = canvas.toDataURL('image/jpeg', finalOptions.quality);
      pdf.addImage(
        imgData, 
        'JPEG', 
        finalOptions.margin!.left, 
        finalOptions.margin!.top, 
        imgWidth, 
        Math.min(imgHeight, pageHeight - (finalOptions.margin!.top + finalOptions.margin!.bottom))
      );

      // Se a imagem for muito alta, adicionar páginas
      if (imgHeight > pageHeight - (finalOptions.margin!.top + finalOptions.margin!.bottom)) {
        const pages = Math.ceil(imgHeight / (pageHeight - (finalOptions.margin!.top + finalOptions.margin!.bottom)));
        console.log(`📄 Criando ${pages} páginas para o PDF`);
        
        for (let i = 1; i < pages; i++) {
          pdf.addPage();
          const yOffset = -i * (pageHeight - (finalOptions.margin!.top + finalOptions.margin!.bottom));
          pdf.addImage(
            imgData, 
            'JPEG', 
            finalOptions.margin!.left, 
            finalOptions.margin!.top + yOffset, 
            imgWidth, 
            imgHeight
          );
        }
      }

      // Gerar nome do arquivo
      const filename = this.generateFilename(cvData.name, finalOptions.filename);
      
      // Fazer download
      pdf.save(filename);

      // Limpar elemento temporário
      this.cleanupElement(preparedElement);

      const fileSize = this.estimateFileSize(canvas);
      
      console.log('✅ PDF exportado com sucesso!');
      return {
        success: true,
        filename,
        size: fileSize
      };

    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }

  /**
   * Prepara o elemento para captura aplicando tema
   */
  private static async prepareElementForCapture(
    element: HTMLElement, 
    theme?: PDFTheme
  ): Promise<HTMLElement> {
    console.log('📋 PREPARANDO ELEMENTO PARA CAPTURA...');
    console.log('📋 Elemento original:', element);
    console.log('📋 Tema recebido:', theme?.name || 'Nenhum');
    
    // Clona o elemento para não afetar o original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    console.log('📋 Elemento clonado criado');
    console.log('📋 Elementos com style no clone:', clonedElement.querySelectorAll('[style]').length);
    
    // Aplica estilos para impressão
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    clonedElement.style.width = '210mm'; // A4 width
    clonedElement.style.minHeight = '297mm'; // A4 height
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.padding = '20mm';
    clonedElement.style.boxSizing = 'border-box';
    clonedElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    
    // NORMALIZA MARGENS NEGATIVAS QUE PODEM CAUSAR PROBLEMAS NO PDF
    this.fixNegativeMargins(clonedElement);
    
    // SEMPRE remove gradientes problemáticos ANTES de aplicar tema
    this.removeProblematicGradients(clonedElement);
    
    // Aplica tema se fornecido
    if (theme) {
      console.log('📋 APLICANDO TEMA:', theme.name);
      this.applyThemeToElement(clonedElement, theme);
      
      // Verifica se foi aplicado
      const elementsAfter = clonedElement.querySelectorAll('[style*="background"]');
      console.log('📋 Elementos com background após tema:', elementsAfter.length);
      elementsAfter.forEach((el, i) => {
        if (el instanceof HTMLElement) {
          console.log(`📋 Elemento ${i}: background = ${el.style.backgroundColor}`);
        }
      });
    }

    // Adiciona ao DOM temporariamente
    document.body.appendChild(clonedElement);
    console.log('📋 Elemento adicionado ao DOM');
    
    // VERIFICAÇÃO FINAL ANTES DA CAPTURA
    console.log('🔍 VERIFICAÇÃO FINAL DO ELEMENTO CLONADO:');
    console.log('🔍 Elemento clonado:', clonedElement);
    console.log('🔍 Tamanho do elemento clonado:', clonedElement.offsetWidth, 'x', clonedElement.offsetHeight);
    console.log('🔍 HTML do elemento clonado:', clonedElement.innerHTML.slice(0, 1000));
    
    // Verifica e FORÇA propriedades do H1 (nome)
    const h1Elements = clonedElement.querySelectorAll('h1');
    console.log('🔍 H1s encontrados no clone:', h1Elements.length);
    h1Elements.forEach((h1, index) => {
      console.log(`🔍 H1 ${index}:`, h1.textContent, '| Style:', h1.getAttribute('style'));
      
      if (h1 instanceof HTMLElement) {
        // FORÇA propriedades para garantir que o nome apareça
        h1.style.setProperty('color', '#ffffff', 'important');
        h1.style.setProperty('font-size', '36px', 'important');
        h1.style.setProperty('font-weight', '300', 'important');
        h1.style.setProperty('text-align', 'center', 'important');
        h1.style.setProperty('margin-bottom', '8px', 'important');
        h1.style.setProperty('display', 'block', 'important');
        h1.style.setProperty('visibility', 'visible', 'important');
        h1.style.setProperty('opacity', '1', 'important');
        h1.style.setProperty('font-family', 'Arial, sans-serif', 'important');
        
        // Se o texto for placeholder, força um nome visível
        if (!h1.textContent || h1.textContent.trim() === '' || h1.textContent === 'Seu Nome') {
          h1.textContent = 'NOME DO USUÁRIO';
          console.log(`🔍 H1 ${index} TEXTO CORRIGIDO PARA: NOME DO USUÁRIO`);
        }
        
        console.log(`🔍 H1 ${index} FORÇADO:`, h1.getAttribute('style'));
        console.log(`🔍 H1 ${index} TEXTO FINAL:`, h1.textContent);
      }
    });
    
    // Verifica se tem o cabeçalho verde
    const headerElements = clonedElement.querySelectorAll('[style*="#6b7f5e"], [style*="backgroundColor"]');
    console.log('🔍 Elementos com cor de fundo encontrados:', headerElements.length);
    headerElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        console.log(`🔍 Header ${index}:`, el.tagName, '| Style:', el.getAttribute('style'));
        console.log(`🔍 Header ${index} conteúdo:`, el.textContent?.slice(0, 100));
      }
    });
    
    // FORÇA todas as linhas decorativas a serem suaves e visíveis
    const allLines = clonedElement.querySelectorAll('[style*="height: 1px"], [style*="height:1px"], [style*="rgba(255,255,255,0.3)"], [style*="height: 2px"]');
    console.log('🔍 Linhas decorativas encontradas:', allLines.length);
    allLines.forEach((line, index) => {
      if (line instanceof HTMLElement) {
        console.log(`📏 MELHORANDO LINHA ${index}:`, line.getAttribute('style'));
        
        // Linha suave e elegante
        line.style.setProperty('background-color', 'rgba(255,255,255,0.7)', 'important');
        line.style.setProperty('height', '1px', 'important');
        line.style.setProperty('display', 'block', 'important');
        line.style.setProperty('width', '100%', 'important');
        line.style.setProperty('opacity', '0.7', 'important');
        line.style.setProperty('border', 'none', 'important');
        line.style.setProperty('border-radius', '0px', 'important');
        line.style.setProperty('box-shadow', '0 0 1px rgba(255,255,255,0.3)', 'important');
        line.style.setProperty('margin', '20px 0', 'important');
        
        console.log(`📏 LINHA ${index} MELHORADA PARA SUAVIDADE`);
      }
    });
    
    // Aguarda um momento para renderização
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return clonedElement;
  }

  /**
   * Corrige margens negativas que podem causar problemas na captura
   */
  private static fixNegativeMargins(element: HTMLElement): void {
    console.log('🔧 CORRIGINDO MARGENS NEGATIVAS...');
    
    // Procura por todos os elementos com margens negativas
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const style = el.getAttribute('style') || '';
        
        // Se tem margens negativas
        if (style.includes('marginLeft: -') || style.includes('marginRight: -') || 
            style.includes('marginTop: -') || style.includes('margin: -')) {
          
          console.log(`🔧 Elemento ${index} com margens negativas encontrado:`, style);
          
          // Se é o cabeçalho principal (tem backgroundColor)
          if (style.includes('backgroundColor') || style.includes('#6b7f5e')) {
            console.log(`🔧 CORRIGINDO CABEÇALHO: removendo margens negativas`);
            
            // Remove margens negativas e ajusta para funcionar bem no PDF
            el.style.marginLeft = '0px';
            el.style.marginRight = '0px';
            el.style.marginTop = '0px';
            
            // Garante que o cabeçalho ocupe toda a largura
            el.style.width = '100%';
            el.style.boxSizing = 'border-box';
            
            console.log(`🔧 CABEÇALHO CORRIGIDO:`, el.getAttribute('style'));
          }
        }
      }
    });
  }

  /**
   * Aplica cores especificamente no cabeçalho PersonalHeader
   */
  private static applyHeaderTheme(element: HTMLElement, theme: PDFTheme): void {
    console.log('🎯 APLICANDO TEMA ESPECÍFICO NO CABEÇALHO...');
    
    // Procura especificamente pelo padrão do PersonalHeader
    // 1. Busca por elementos que têm a cor verde específica (#6b7f5e)
    const greenElements = element.querySelectorAll('*');
    let headerFound = false;
    
    greenElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const style = el.getAttribute('style') || '';
        const computedStyle = window.getComputedStyle(el);
        
        // Verifica se tem a cor verde do header
        if (style.includes('#6b7f5e') || style.includes('backgroundColor') || 
            computedStyle.backgroundColor === 'rgb(107, 127, 94)') {
          
          console.log(`🎯 HEADER ENCONTRADO ${index}!`);
          console.log(`🎯 Style original: ${style}`);
          console.log(`🎯 Background computado: ${computedStyle.backgroundColor}`);
          
          // Aplica a nova cor
          el.style.setProperty('background-color', theme.colors.primary, 'important');
          el.style.setProperty('color', theme.colors.headerText, 'important');
          
          // Procura por elementos filhos que são a linha branca
          const children = el.querySelectorAll('*');
          children.forEach((child) => {
            if (child instanceof HTMLElement) {
              const childStyle = child.getAttribute('style') || '';
              // Se é a linha branca semi-transparente ou qualquer linha fina
              if (childStyle.includes('rgba(255,255,255,0.3)') || 
                  childStyle.includes('height: 1px') ||
                  childStyle.includes('height:1px') ||
                  (childStyle.includes('height') && childStyle.includes('1px'))) {
                console.log(`🎯 LINHA DECORATIVA ENCONTRADA: ${childStyle}`);
                
                // FORÇA a linha a aparecer com cor mais visível e espessura adequada
                child.style.setProperty('background-color', 'rgba(255,255,255,0.8)', 'important');
                child.style.setProperty('height', '2px', 'important');
                child.style.setProperty('width', '100%', 'important');
                child.style.setProperty('display', 'block', 'important');
                child.style.setProperty('border', 'none', 'important');
                child.style.setProperty('margin', '20px 0', 'important');
                
                console.log(`🎯 LINHA FORÇADA: altura=2px, cor=rgba(255,255,255,0.8)`);
              }
            }
          });
          
          // Se não encontrou a linha decorativa, cria uma nova
          const existingLine = el.querySelector('[style*="height: 1px"], [style*="height:1px"]');
          if (!existingLine) {
            console.log(`🎯 CRIANDO LINHA DECORATIVA NOVA`);
            const decorativeLine = document.createElement('div');
            decorativeLine.style.setProperty('height', '2px', 'important');
            decorativeLine.style.setProperty('background-color', 'rgba(255,255,255,0.8)', 'important');
            decorativeLine.style.setProperty('width', '100%', 'important');
            decorativeLine.style.setProperty('margin', '20px 0', 'important');
            decorativeLine.style.setProperty('display', 'block', 'important');
            
            // Insere a linha após o H1 (nome)
            const h1 = el.querySelector('h1');
            if (h1 && h1.parentNode) {
              h1.parentNode.insertBefore(decorativeLine, h1.nextSibling);
              console.log(`🎯 LINHA DECORATIVA INSERIDA APÓS H1`);
            }
          }
          
          headerFound = true;
          console.log(`🎯 HEADER TEMA APLICADO: ${theme.colors.primary}`);
        }
      }
    });
    
    if (!headerFound) {
      console.log('🎯 HEADER NÃO ENCONTRADO - usando estratégia alternativa');
      
      // Estratégia alternativa: procura por H1 (título do nome)
      const h1Elements = element.querySelectorAll('h1');
      h1Elements.forEach((h1) => {
        if (h1.parentElement && h1.parentElement instanceof HTMLElement) {
          console.log('🎯 APLICANDO TEMA VIA H1 PARENT');
          h1.parentElement.style.setProperty('background-color', theme.colors.primary, 'important');
          h1.parentElement.style.setProperty('color', theme.colors.headerText, 'important');
        }
      });
    }
  }

  /**
   * Remove gradientes problemáticos que causam erro no html2canvas
   */
  private static removeProblematicGradients(element: HTMLElement): void {
    console.log('🔧 Removendo gradientes problemáticos...');
    
    // Remove TODOS os gradientes inline que causam problema no html2canvas
    const elementsWithGradients = element.querySelectorAll('[style*="linear-gradient"], [style*="radial-gradient"], [style*="conic-gradient"]');
    elementsWithGradients.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const currentStyle = el.style.background || el.style.backgroundImage;
        console.log(`🔧 Elemento ${index} com gradiente encontrado:`, currentStyle);
        
        // Substitui por cor sólida segura
        el.style.background = '#6b7f5e'; // Verde padrão
        el.style.backgroundImage = 'none';
        el.style.setProperty('background', '#6b7f5e', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        
        console.log(`✅ Gradiente ${index} removido e substituído por cor sólida`);
      }
    });
    
    // Remove gradientes em classes CSS problemáticas
    const gradientClasses = element.querySelectorAll('[class*="gradient"], [class*="bg-gradient"]');
    gradientClasses.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.background = '#6b7f5e';
        el.style.backgroundImage = 'none';
        el.style.setProperty('background', '#6b7f5e', 'important');
        el.style.setProperty('background-image', 'none', 'important');
        console.log(`✅ Classe gradiente ${index} neutralizada`);
      }
    });
  }

  /**
   * Aplica tema ao elemento clonado
   */
  private static applyThemeToElement(element: HTMLElement, theme: PDFTheme): void {
    console.log('🎨 Aplicando tema:', theme.name);
    console.log('🎨 Cores do tema:', theme.colors);
    
    // ESTRATÉGIA ESPECÍFICA: Procura pelo padrão do PersonalHeader
    this.applyHeaderTheme(element, theme);
    
    // 1. ESTRATÉGIA MÚLTIPLA para encontrar o cabeçalho
    
    // Busca A: Elementos com backgroundColor inline
    const headerElements1 = element.querySelectorAll('[style*="backgroundColor"]');
    console.log('🎨 Método A - backgroundColor encontrados:', headerElements1.length);
    
    // Busca B: Elementos com background-color inline  
    const headerElements2 = element.querySelectorAll('[style*="background-color"]');
    console.log('🎨 Método B - background-color encontrados:', headerElements2.length);
    
    // Busca C: Busca por cor específica do verde padrão
    const headerElements3 = element.querySelectorAll('[style*="#6b7f5e"], [style*="rgb(107, 127, 94)"]');
    console.log('🎨 Método C - cor verde específica encontrados:', headerElements3.length);
    
    // Busca D: Todos os divs com style (força bruta)
    const allDivs = element.querySelectorAll('div[style]');
    console.log('🎨 Método D - divs com style encontrados:', allDivs.length);
    
    // Combina todos os resultados
    const allHeaderElements = new Set([
      ...Array.from(headerElements1),
      ...Array.from(headerElements2), 
      ...Array.from(headerElements3)
    ]);
    
    console.log('🎨 Total de elementos únicos para aplicar cor:', allHeaderElements.size);
    
    // Aplica cor em todos os elementos encontrados
    allHeaderElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const oldBg = el.style.backgroundColor;
        const oldColor = el.style.color;
        
        // Força aplicação da cor (remove !important pois não funciona em style inline)
        el.style.setProperty('background-color', theme.colors.primary, 'important');
        el.style.setProperty('color', theme.colors.headerText, 'important');
        
        console.log(`🎨 Header ${index}: ${oldBg} → ${theme.colors.primary}`);
        console.log(`🎨 Header texto ${index}: ${oldColor} → ${theme.colors.headerText}`);
      }
    });
    
    // FORÇA BRUTA: Procura por QUALQUER elemento com a cor verde padrão
    allDivs.forEach((div, index) => {
      if (div instanceof HTMLElement) {
        const style = div.getAttribute('style') || '';
        if (style.includes('#6b7f5e') || style.includes('backgroundColor') || style.includes('background-color')) {
          console.log(`🎨 FORÇA BRUTA ${index}: Encontrado elemento suspeito`);
          console.log(`🎨 FORÇA BRUTA ${index}: Style = ${style}`);
          
          // Múltiplas tentativas de aplicar a cor
          div.style.backgroundColor = theme.colors.primary;
          div.style.setProperty('background-color', theme.colors.primary, 'important');
          div.setAttribute('style', style.replace('#6b7f5e', theme.colors.primary));
          
          div.style.color = theme.colors.headerText;
          div.style.setProperty('color', theme.colors.headerText, 'important');
          
          console.log(`🎨 FORÇA BRUTA ${index}: Aplicado ${theme.colors.primary}`);
          console.log(`🎨 FORÇA BRUTA ${index}: Novo style = ${div.getAttribute('style')}`);
        }
      }
    });
    
    // SUPER FORÇA BRUTA: Se nada funcionou, procura especificamente por divs que contêm texto como "Nome"
    const textDivs = element.querySelectorAll('div');
    textDivs.forEach((div, index) => {
      if (div instanceof HTMLElement && div.textContent && 
          (div.textContent.includes('Nome') || div.textContent.includes('email') || div.textContent.includes('@'))) {
        const parent = div.parentElement;
        if (parent && parent.style && parent.style.backgroundColor) {
          console.log(`🎨 SUPER FORÇA BRUTA ${index}: Encontrado div com texto relevante`);
          console.log(`🎨 SUPER FORÇA BRUTA ${index}: Parent background = ${parent.style.backgroundColor}`);
          
          parent.style.setProperty('background-color', theme.colors.primary, 'important');
          parent.style.setProperty('color', theme.colors.headerText, 'important');
          
          console.log(`🎨 SUPER FORÇA BRUTA ${index}: Aplicado no parent`);
        }
      }
    });

    // MEGA FORÇA BRUTA: Procura por QUALQUER div com cor de fundo e aplica o tema
    const allElementsWithBg = element.querySelectorAll('*');
    allElementsWithBg.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        const computedStyle = window.getComputedStyle(el);
        const bgColor = computedStyle.backgroundColor;
        
        // Se tem cor de fundo que não é transparente/branca
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' && bgColor !== 'rgb(255, 255, 255)') {
          console.log(`🎨 MEGA FORÇA BRUTA ${index}: Elemento com background detectado`);
          console.log(`🎨 MEGA FORÇA BRUTA ${index}: Background = ${bgColor}`);
          console.log(`🎨 MEGA FORÇA BRUTA ${index}: Tag = ${el.tagName}`);
          
          // Se é um elemento de cabeçalho (contém texto ou está em posição de header)
          if (el.textContent && (el.textContent.includes('Nome') || el.textContent.includes('@') || 
              el.getBoundingClientRect().top < 200)) {
            el.style.setProperty('background-color', theme.colors.primary, 'important');
            el.style.setProperty('color', theme.colors.headerText, 'important');
            console.log(`🎨 MEGA FORÇA BRUTA ${index}: Aplicado tema no elemento`);
          }
        }
      }
    });

    // 2. Remove gradientes problemáticos e aplica cores sólidas
    const gradientElements = element.querySelectorAll('[class*="gradient"], [style*="gradient"], [class*="bg-gradient"]');
    gradientElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Remove gradientes e aplica cor sólida
        el.style.background = theme.colors.sectionBg;
        el.style.backgroundImage = 'none';
        el.style.setProperty('background', theme.colors.sectionBg, 'important');
        el.style.setProperty('background-image', 'none', 'important');
        console.log(`🎨 Gradiente/Fundo ${index}: aplicado ${theme.colors.sectionBg}`);
      }
    });

    // 3. Remove TODOS os gradientes inline perigosos para html2canvas
    const allElementsWithStyle = element.querySelectorAll('[style*="linear-gradient"], [style*="radial-gradient"], [style*="conic-gradient"]');
    allElementsWithStyle.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Substitui gradientes por cor sólida baseada no tema
        el.style.background = theme.colors.primary;
        el.style.backgroundImage = 'none';
        el.style.setProperty('background', theme.colors.primary, 'important');
        el.style.setProperty('background-image', 'none', 'important');
        console.log(`🔧 Gradiente inline ${index}: removido e substituído por cor sólida`);
      }
    });

    // 4. Aplica cor de fundo geral
    element.style.backgroundColor = theme.colors.background;
    element.style.color = theme.colors.text;
    
    // 5. Aplica cores nos títulos das seções (H1, H2, H3, etc)
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (heading instanceof HTMLElement) {
        heading.style.color = theme.colors.primary;
        console.log(`🎨 Título ${index}: aplicado ${theme.colors.primary}`);
      }
    });

    // 5. Aplica cor em elementos com bordas coloridas
    const coloredBorders = element.querySelectorAll('[class*="border-"], [style*="border-color"]');
    coloredBorders.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.borderColor = theme.colors.accent;
        console.log(`🎨 Borda ${index}: aplicado ${theme.colors.accent}`);
      }
    });

    // 6. Aplica cor em elementos de destaque específicos
    const accentElements = element.querySelectorAll('[class*="text-blue"], [class*="text-purple"], [class*="bg-blue"], [class*="bg-purple"]');
    accentElements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        // Se é um fundo, aplica cor de fundo
        if (el.className.includes('bg-')) {
          el.style.backgroundColor = theme.colors.sectionBg;
        } else {
          // Se é texto, aplica cor de destaque
          el.style.color = theme.colors.accent;
        }
        console.log(`🎨 Elemento destaque ${index}: aplicado tema`);
      }
    });

    // 7. Aplica cores em barras de progresso (se houver)
    const progressBars = element.querySelectorAll('[class*="progress"], [class*="bar"]');
    progressBars.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.backgroundColor = theme.colors.accent;
        console.log(`🎨 Barra de progresso ${index}: aplicado ${theme.colors.accent}`);
      }
    });
  }

  /**
   * Remove elemento temporário do DOM
   */
  private static cleanupElement(element: HTMLElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  /**
   * Gera nome do arquivo baseado no nome do usuário
   */
  private static generateFilename(userName: string, customFilename?: string): string {
    if (customFilename) {
      return customFilename.endsWith('.pdf') ? customFilename : `${customFilename}.pdf`;
    }
    
    const cleanName = userName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const timestamp = new Date().toISOString().split('T')[0];
    return `curriculo-${cleanName || 'usuario'}-${timestamp}.pdf`;
  }

  /**
   * Estima o tamanho do arquivo gerado
   */
  private static estimateFileSize(canvas: HTMLCanvasElement): string {
    const bytes = (canvas.width * canvas.height * 4) * 0.3; // Estimativa
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)}KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  /**
   * Valida se o elemento pode ser exportado
   */
  static validateElement(element: HTMLElement): boolean {
    return !!(element && element.offsetWidth > 0 && element.offsetHeight > 0);
  }
}

/**
 * Função helper para exportação rápida
 */
export async function exportCVToPDF(
  element: HTMLElement,
  cvData: { name: string; email: string; phone: string },
  options?: PDFExportOptions
): Promise<PDFExportResult> {
  return PDFService.exportToPDF({
    element,
    cvData,
    options: options || {}
  });
}
