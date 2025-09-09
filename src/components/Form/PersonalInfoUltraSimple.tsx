// Versão ultra-simplificada para resolver o problema crítico
import React, { useState, useEffect } from 'react';
import type { PersonalInfo as PersonalInfoType, CVDataActions } from '../../types/cv.types';
import { AIEnhanceButton } from './AIEnhanceButton';
import { validateEmail, validateLinkedIn, validatePhone, formatPhone } from '../../utils/validation';

interface PersonalInfoProps {
  data: PersonalInfoType;
  actions: CVDataActions;
}

const PersonalInfoUltraSimple: React.FC<PersonalInfoProps> = ({ data, actions }) => {
  // Debug temporário
  console.log('Debug - data.summary:', `"${data.summary}"`, 'length:', data.summary.length);
  const [emailError, setEmailError] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [linkedinError, setLinkedinError] = useState<string>('');
  const [linkedinTouched, setLinkedinTouched] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [summaryLength, setSummaryLength] = useState(0);

  // Sincroniza o contador local com o estado global
  useEffect(() => {
    setSummaryLength(data.summary?.length || 0);
  }, [data.summary]);

  // Valida email quando o campo perde o foco
  const handleEmailBlur = () => {
    setEmailTouched(true);
    const validation = validateEmail(data.email);
    setEmailError(validation.error || '');
  };

  // Valida LinkedIn quando o campo perde o foco
  const handleLinkedInBlur = () => {
    setLinkedinTouched(true);
    const validation = validateLinkedIn(data.linkedin);
    setLinkedinError(validation.error || '');
  };

  // Valida e formata telefone quando o campo perde o foco
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    
    if (!data.phone.trim()) {
      setPhoneError('Telefone é obrigatório');
      return;
    }
    
    const validation = validatePhone(data.phone);
    setPhoneError(validation.error || '');
    
    console.log('Debug telefone - original:', data.phone, 'válido:', validation.isValid);
    
    // Aplica formatação sempre que o telefone tem números suficientes
    if (data.phone) {
      const formattedPhone = formatPhone(data.phone);
      console.log('Debug telefone - formatado:', formattedPhone);
      if (formattedPhone !== data.phone) {
        actions.updatePersonalInfo('phone', formattedPhone);
      }
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
        Dados Pessoais
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Nome */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            Nome Completo *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => actions.updatePersonalInfo('name', e.target.value)}
            placeholder="Digite seu nome completo"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            Email *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => {
              actions.updatePersonalInfo('email', e.target.value);
              // Limpa erro se o usuário está digitando
              if (emailTouched && emailError) {
                setEmailError('');
              }
            }}
            onBlur={handleEmailBlur}
            placeholder="seu.email@exemplo.com"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: `1px solid ${emailError ? '#dc2626' : '#d1d5db'}`, 
              borderRadius: '6px',
              fontSize: '14px',
              outline: emailError ? '2px solid #fecaca' : 'none'
            }}
          />
          {emailError && (
            <p style={{ 
              fontSize: '12px', 
              color: '#dc2626', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ❌ {emailError}
            </p>
          )}
          {!emailError && emailTouched && data.email && (
            <p style={{ 
              fontSize: '12px', 
              color: '#059669', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✅ Email válido
            </p>
          )}
        </div>
        
        {/* Telefone */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            Telefone *
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => {
              actions.updatePersonalInfo('phone', e.target.value);
              // Limpa erro se o usuário está digitando
              if (phoneTouched && phoneError) {
                setPhoneError('');
              }
            }}
            onBlur={handlePhoneBlur}
            placeholder="(11) 99999-9999"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: `1px solid ${phoneError ? '#dc2626' : '#d1d5db'}`, 
              borderRadius: '6px',
              fontSize: '14px',
              outline: phoneError ? '2px solid #fecaca' : 'none'
            }}
          />
          {phoneError && (
            <p style={{ 
              fontSize: '12px', 
              color: '#dc2626', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ❌ {phoneError}
            </p>
          )}
          {!phoneError && phoneTouched && data.phone && (
            <p style={{ 
              fontSize: '12px', 
              color: '#059669', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✅ Telefone válido
            </p>
          )}
        </div>
        
        {/* LinkedIn */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#374151' }}>
            LinkedIn <span style={{ fontSize: '12px', color: '#6b7280' }}>(opcional)</span>
          </label>
          <input
            type="url"
            value={data.linkedin}
            onChange={(e) => {
              actions.updatePersonalInfo('linkedin', e.target.value);
              // Limpa erro se o usuário está digitando
              if (linkedinTouched && linkedinError) {
                setLinkedinError('');
              }
            }}
            onBlur={handleLinkedInBlur}
            placeholder="https://linkedin.com/in/seuperfil"
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: `1px solid ${linkedinError ? '#dc2626' : '#d1d5db'}`, 
              borderRadius: '6px',
              fontSize: '14px',
              outline: linkedinError ? '2px solid #fecaca' : 'none'
            }}
          />
          {linkedinError && (
            <p style={{ 
              fontSize: '12px', 
              color: '#dc2626', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ❌ {linkedinError}
            </p>
          )}
          {!linkedinError && linkedinTouched && data.linkedin && (
            <p style={{ 
              fontSize: '12px', 
              color: '#059669', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✅ LinkedIn válido
            </p>
          )}
        </div>
        
        {/* Resumo */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Resumo Profissional *
            </label>
            <button
              type="button"
              onClick={() => {
                actions.updatePersonalInfo('summary', '');
                setSummaryLength(0);
              }}
              style={{ 
                fontSize: '12px', 
                color: '#dc2626', 
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Limpar
            </button>
          </div>
          <textarea
            value={data.summary}
            onChange={(e) => {
              const newValue = e.target.value;
              // Atualiza o contador local imediatamente
              setSummaryLength(newValue.length);
              // Sempre permite a digitação até 500 caracteres
              if (newValue.length <= 500) {
                actions.updatePersonalInfo('summary', newValue);
              }
            }}
            placeholder="Descreva brevemente sua experiência profissional..."
            rows={4}
            maxLength={500}
            style={{ 
              width: '100%', 
              padding: '8px 12px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />
          <p style={{ 
            fontSize: '12px', 
            marginTop: '4px',
            color: summaryLength >= 500 ? '#dc2626' : summaryLength > 450 ? '#d97706' : '#6b7280',
            fontWeight: summaryLength >= 500 ? 'bold' : 'normal'
          }}>
            {summaryLength}/500 caracteres
            {summaryLength >= 500 && (
              <span style={{ marginLeft: '8px' }}>🚫 Limite atingido</span>
            )}
            {summaryLength > 450 && summaryLength < 500 && (
              <span style={{ marginLeft: '8px' }}>⚠️ Próximo do limite</span>
            )}
          </p>
          
          {/* Botão Melhorar com IA para o Resumo */}
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
            <AIEnhanceButton
              field="summary"
              text={data.summary || ""}
              onEnhanced={(enhancedText) => {
                actions.updatePersonalInfo('summary', enhancedText);
                setSummaryLength(enhancedText.length);
              }}
              size="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoUltraSimple;
