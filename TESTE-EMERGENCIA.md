# 🚨 TESTE DE EMERGÊNCIA - Página Sumindo

## Problema Identificado
A página está sumindo quando você começa a digitar - isso indica um erro crítico na aplicação.

## 🔧 Solução Implementada

Criei uma versão **ultra-simplificada** para identificar o problema:

### ✅ AppDebug.tsx
- Componente mínimo com apenas 2 campos
- CSS inline (sem TailwindCSS)
- Console.log para debug
- Estado local simples

## 🧪 Como Testar AGORA

1. **Recarregue a página** no navegador (Ctrl+F5)
2. **Abra o Console** (F12 → Console)
3. **Digite nos campos** e observe:
   - A página deve permanecer visível
   - Deve aparecer logs no console
   - Os valores devem aparecer na seção Debug

## 🔍 O que Observar

### ✅ Se Funcionar:
- Página não some
- Console mostra logs
- Debug atualiza em tempo real
- **Problema estava no componente complexo**

### ❌ Se Ainda Sumir:
- Verifique erros no console (F12)
- Pode ser problema de:
  - TailwindCSS
  - React StrictMode
  - Configuração do Vite
  - Extensões do navegador

## 🚀 Próximos Passos

### Se o AppDebug Funcionar:
1. ✅ Problema identificado nos componentes complexos
2. ✅ Reconstruir componente gradualmente
3. ✅ Adicionar funcionalidades uma por vez

### Se Ainda Não Funcionar:
1. 🔍 Testar em modo incógnito
2. 🔍 Desabilitar extensões
3. 🔍 Verificar console de erros
4. 🔍 Testar em outro navegador

## 📝 Logs Esperados no Console

Quando você digitar, deve aparecer:
```
AppDebug renderizando... {name: "", email: ""}
Mudando nome: G
AppDebug renderizando... {name: "G", email: ""}
Mudando nome: Gu
AppDebug renderizando... {name: "Gu", email: ""}
```

---

**Status**: 🧪 **TESTE CRÍTICO**  
**Objetivo**: Identificar se é problema de componente ou configuração  
**Ação**: Teste imediatamente e reporte resultado
