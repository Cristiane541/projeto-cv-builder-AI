# Componente PersonalInfo

## Descrição
O componente `PersonalInfo` é responsável por coletar e validar os dados pessoais do usuário no formulário de criação de currículo. Ele implementa validação em tempo real, formatação automática e feedback visual para uma melhor experiência do usuário.

## Funcionalidades Implementadas

### ✅ Campos Obrigatórios
- **Nome Completo**: Validação de presença e tamanho mínimo
- **Email**: Validação de formato de email válido
- **Telefone**: Formatação automática e validação de DDD
- **LinkedIn**: Validação de URL (opcional)
- **Resumo Profissional**: Validação de tamanho e contador de caracteres

### ✅ Validação em Tempo Real
- Validação ocorre quando o campo perde o foco (onBlur)
- Feedback visual imediato com bordas vermelhas para erros
- Mensagens de erro específicas para cada tipo de validação

### ✅ Contador de Caracteres
- Contador visual para o campo de resumo (máximo 500 caracteres)
- Mudança de cor baseada na proximidade do limite:
  - Verde: < 70% do limite
  - Amarelo: 70-90% do limite  
  - Vermelho: > 90% do limite

### ✅ Formatação Automática
- Telefone é formatado automaticamente: `(11) 99999-9999`
- Preserva apenas números para validação

### ✅ Indicador de Progresso
- Barra de progresso visual mostrando % de preenchimento
- Atualização em tempo real conforme campos são preenchidos

## Interface e Props

```typescript
interface PersonalInfoProps {
  data: PersonalInfoType;     // Dados atuais do formulário
  actions: CVDataActions;     // Callbacks para atualização
}
```

## Uso

```tsx
import PersonalInfo from './components/Form/PersonalInfo';
import { useCVData } from './hooks/useCVData';

function App() {
  const { cvData, actions } = useCVData();
  
  return (
    <PersonalInfo 
      data={cvData.personal} 
      actions={actions} 
    />
  );
}
```

## Validações Implementadas

### Nome
- Obrigatório
- Mínimo 2 caracteres

### Email  
- Obrigatório
- Formato de email válido (regex)

### Telefone
- Obrigatório  
- 10 ou 11 dígitos
- Formatação automática com DDD

### LinkedIn
- Opcional
- Deve seguir formato: `https://linkedin.com/in/perfil`

### Resumo
- Obrigatório
- Mínimo 50 caracteres
- Máximo 500 caracteres
- Contador visual de caracteres

## Integração com Estado Central

O componente utiliza o hook `useCVData` que fornece:
- `cvData.personal`: Dados atuais do formulário
- `actions.updatePersonalInfo`: Callback para atualizar campos individuais

## Exemplo Completo

Veja o arquivo `src/examples/PersonalInfoExample.tsx` para um exemplo completo de uso.

## Dependências

- React 19+
- TailwindCSS v4
- TypeScript
- Utilitários de validação (`src/utils/validation.ts`)
- Tipos TypeScript (`src/types/cv.types.ts`)
