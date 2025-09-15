// Versão ultra-simplificada para resolver o problema crítico
import React, { useState, useEffect } from 'react';
import { Eraser, User, Envelope, Phone, LinkedinLogo, FileText, ArrowCounterClockwise, ArrowClockwise } from "phosphor-react";
import type { ChangeEvent } from 'react';
import type { PersonalInfo as PersonalInfoType, CVDataActions } from '../../types/cv.types';
import { AIEnhanceButton } from './AIEnhanceButton';
import { validateEmail, validateLinkedIn, validatePhone, formatPhone } from '../../utils/validation';

interface PersonalInfoProps {
  data: PersonalInfoType;
  actions: CVDataActions;
  setPersonalState: (value: PersonalInfoType) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PersonalInfoUltraSimple: React.FC<PersonalInfoProps> = ({ data, actions, setPersonalState, undo, redo, canUndo, canRedo }) => {
  // Estado local para edição em tempo real
  const [localData, setLocalData] = useState<PersonalInfoType>(data);
  
  // Debug temporário
  console.log('Debug PersonalInfo - data:', data);
  console.log('Debug PersonalInfo - localData:', localData);
  console.log('Debug PersonalInfo - canUndo:', canUndo, 'canRedo:', canRedo);
  
  const [emailError, setEmailError] = useState<string>('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [linkedinError, setLinkedinError] = useState<string>('');
  const [linkedinTouched, setLinkedinTouched] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [summaryLength, setSummaryLength] = useState(0);

  // Sincroniza estado local quando data muda (undo/redo)
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Sincroniza o contador local com o estado global
  useEffect(() => {
    setSummaryLength(localData.summary?.length || 0);
  }, [localData.summary]);

  // Valida email quando o campo perde o foco
  const handleEmailBlur = () => {
    setEmailTouched(true);
    const validation = validateEmail(localData.email);
    setEmailError(validation.error || '');
  };

  // Valida LinkedIn quando o campo perde o foco
  const handleLinkedInBlur = () => {
    setLinkedinTouched(true);
    const validation = validateLinkedIn(localData.linkedin);
    setLinkedinError(validation.error || '');
  };

  // Valida e formata telefone quando o campo perde o foco
  const handlePhoneBlur = () => {
    setPhoneTouched(true);
    
    if (!localData.phone.trim()) {
      setPhoneError('Telefone é obrigatório');
      return;
    }
    
    const validation = validatePhone(localData.phone);
    setPhoneError(validation.error || '');
    
    console.log('Debug telefone - original:', localData.phone, 'válido:', validation.isValid);
    
    // Aplica formatação sempre que o telefone tem números suficientes
    if (localData.phone) {
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
          <label style={{ 
            fontSize: '15px', 
            fontWeight: '700', 
            marginBottom: '8px', 
            color: '#0073b1',
            fontFamily: 'Montserrat, Arial, sans-serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <User size={20} color="#0073b1" weight="bold" /> Nome Completo *
          </label>
          <input
            type="text"
            value={localData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              setLocalData({ ...localData, name: newValue });
            }}
            onBlur={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              const newState = { ...localData, name: newValue };
              console.log('💾 Salvando nome no histórico:', newValue);
              setPersonalState(newState);
              actions.updatePersonalInfo('name', newValue);
              e.target.style.border = '2px solid #e5f3ff';
              e.target.style.boxShadow = '0 2px 8px rgba(0,115,177,0.08)';
              e.target.style.transform = 'translateY(0)';
            }}
            placeholder="Digite seu nome completo"
            style={{ 
              width: '100%', 
              padding: '14px 18px', 
              border: '2px solid #e5f3ff', 
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,115,177,0.08)',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #0073b1';
              e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
              e.target.style.transform = 'translateY(-1px)';
            }}
          />
        </div>
        
        {/* Email */}
        <div>
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px', 
            fontWeight: '700', 
            marginBottom: '8px', 
            color: '#0073b1',
            fontFamily: 'Montserrat, Arial, sans-serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <Envelope size={20} color="#0073b1" weight="bold" /> Email *
          </label>
          <input
            type="email"
            value={localData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              setLocalData({ ...localData, email: newValue });
              // Limpa erro se o usuário está digitando
              if (emailTouched && emailError) {
                setEmailError('');
              }
            }}
            onBlur={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              const newState = { ...localData, email: newValue };
              setPersonalState(newState);
              actions.updatePersonalInfo('email', newValue);
              handleEmailBlur();
            }}
            placeholder="seu.email@exemplo.com"
            style={{ 
              width: '100%', 
              padding: '14px 18px', 
              border: `2px solid ${emailError ? '#dc2626' : '#e5f3ff'}`,
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
              transition: 'all 0.3s ease',
              boxShadow: emailError ? '0 4px 16px rgba(220,38,38,0.15)' : '0 2px 8px rgba(0,115,177,0.08)',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!emailError) {
                e.target.style.border = '2px solid #0073b1';
                e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
          />
          {emailError && (
            <p style={{ 
              fontSize: '13px', 
              color: '#dc2626', 
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}>
              ❌ {emailError}
            </p>
          )}
          {!emailError && emailTouched && data.email && (
            <p style={{ 
              fontSize: '13px', 
              color: '#0073b1', 
              marginTop: '6px',
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
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px', 
            fontWeight: '700', 
            marginBottom: '8px', 
            color: '#0073b1',
            fontFamily: 'Montserrat, Arial, sans-serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <Phone size={20} color="#0073b1" weight="bold" /> Telefone *
          </label>
          <input
            type="tel"
            value={localData.phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              // Permite apenas números, parênteses, hífen e espaços para formatação
              const filteredValue = e.target.value.replace(/[^0-9()\-\s]/g, '');
              // Limita a 15 caracteres (formato brasileiro: (XX) XXXXX-XXXX)
              if (filteredValue.length <= 15) {
                setLocalData({ ...localData, phone: filteredValue });
              }
              // Limpa erro se o usuário está digitando
              if (phoneTouched && phoneError) {
                setPhoneError('');
              }
            }}
            onBlur={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              const newState = { ...localData, phone: newValue };
              setPersonalState(newState);
              actions.updatePersonalInfo('phone', newValue);
              handlePhoneBlur();
            }}
            placeholder="(11) 99999-9999"
            maxLength={15}
            style={{ 
              width: '100%', 
              padding: '14px 18px', 
              border: `2px solid ${phoneError ? '#dc2626' : '#e5f3ff'}`,
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
              transition: 'all 0.3s ease',
              boxShadow: phoneError ? '0 4px 16px rgba(220,38,38,0.15)' : '0 2px 8px rgba(0,115,177,0.08)',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!phoneError) {
                e.target.style.border = '2px solid #0073b1';
                e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
          />
          {phoneError && (
            <p style={{ 
              fontSize: '13px', 
              color: '#dc2626', 
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}>
              ❌ {phoneError}
            </p>
          )}
          {!phoneError && phoneTouched && data.phone && (
            <p style={{ 
              fontSize: '12px', 
              color: '#0073b1', 
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
          <label style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '15px', 
            fontWeight: '700', 
            marginBottom: '8px', 
            color: '#0073b1',
            fontFamily: 'Montserrat, Arial, sans-serif',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            <LinkedinLogo size={20} color="#0073b1" weight="bold" /> LinkedIn <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'lowercase' }}>(opcional)</span>
          </label>
          <input
            type="url"
            value={localData.linkedin}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              setLocalData({ ...localData, linkedin: newValue });
              // Limpa erro se o usuário está digitando
              if (linkedinTouched && linkedinError) {
                setLinkedinError('');
              }
            }}
            onBlur={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.value;
              const newState = { ...localData, linkedin: newValue };
              setPersonalState(newState);
              actions.updatePersonalInfo('linkedin', newValue);
              handleLinkedInBlur();
            }}
            placeholder="https://linkedin.com/in/seuperfil"
            style={{ 
              width: '100%', 
              padding: '14px 18px', 
              border: `2px solid ${linkedinError ? '#dc2626' : '#e5f3ff'}`,
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
              transition: 'all 0.3s ease',
              boxShadow: linkedinError ? '0 4px 16px rgba(220,38,38,0.15)' : '0 2px 8px rgba(0,115,177,0.08)',
              outline: 'none'
            }}
            onFocus={(e) => {
              if (!linkedinError) {
                e.target.style.border = '2px solid #0073b1';
                e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
          />
          {linkedinError && (
            <p style={{ 
              fontSize: '13px', 
              color: '#dc2626', 
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}>
              ❌ {linkedinError}
            </p>
          )}
          {!linkedinError && linkedinTouched && data.linkedin && (
            <p style={{ 
              fontSize: '13px', 
              color: '#0073b1', 
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}>
              ✅ LinkedIn válido
            </p>
          )}
        </div>
        
        {/* Resumo */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px', 
              fontWeight: '700', 
              color: '#0073b1',
              fontFamily: 'Montserrat, Arial, sans-serif',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              <FileText size={20} color="#0073b1" weight="bold" /> Resumo Profissional *
            </label>
            <button
              type="button"
              onClick={() => {
                const newState = { ...localData, summary: '' };
                setLocalData(newState);
                setPersonalState(newState);
                actions.updatePersonalInfo('summary', '');
                setSummaryLength(0);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#ffeaea', color: '#dc2626', border: 'none', borderRadius: 8,
                padding: '6px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(220,38,38,0.08)', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#ffd6d6'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffeaea'}
            >
              <Eraser size={16} color="#dc2626" weight="bold" /> Limpar
            </button>
          </div>
          <textarea
            value={localData.summary}
            placeholder="Descreva brevemente sua experiência profissional, principais conquistas, tecnologias que domina e objetivos de carreira..."
            rows={6}
            maxLength={500}
            style={{ 
              width: '100%', 
              padding: '14px 18px', 
              border: '2px solid #e5f3ff', 
              borderRadius: '12px',
              fontSize: '16px',
              fontFamily: 'Montserrat, Arial, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fcff 100%)',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,115,177,0.08)',
              outline: 'none',
              resize: 'vertical',
              minHeight: '180px'
            }}
            onFocus={(e) => {
              e.target.style.border = '2px solid #0073b1';
              e.target.style.boxShadow = '0 4px 16px rgba(0,115,177,0.15)';
            }}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const newValue = e.target.value;
              setSummaryLength(newValue.length);
              if (newValue.length <= 500) {
                setLocalData({ ...localData, summary: newValue });
              }
            }}
            onBlur={(e: ChangeEvent<HTMLTextAreaElement>) => {
              const newValue = e.target.value;
              const newState = { ...localData, summary: newValue };
              setPersonalState(newState);
              actions.updatePersonalInfo('summary', newValue);
              e.target.style.border = '2px solid #e5f3ff';
              e.target.style.boxShadow = '0 2px 8px rgba(0,115,177,0.08)';
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
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button" 
                onClick={() => {
                  console.log('🔙 Clicou em Desfazer');
                  undo();
                }} 
                disabled={!canUndo} 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px', 
                  borderRadius: 8, 
                  background: canUndo ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' : '#f9fafb', 
                  border: canUndo ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  cursor: canUndo ? 'pointer' : 'not-allowed',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontSize: 13,
                  fontWeight: '600',
                  color: canUndo ? '#374151' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  opacity: canUndo ? 1 : 0.6,
                  transform: canUndo ? 'scale(1)' : 'scale(0.98)',
                }}
                onMouseEnter={(e) => {
                  if (canUndo) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canUndo) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <ArrowCounterClockwise size={14} weight="bold" />
                Desfazer
              </button>
              <button 
                type="button" 
                onClick={redo} 
                disabled={!canRedo} 
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px', 
                  borderRadius: 8, 
                  background: canRedo ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' : '#f9fafb', 
                  border: canRedo ? '1px solid #d1d5db' : '1px solid #e5e7eb',
                  cursor: canRedo ? 'pointer' : 'not-allowed',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontSize: 13,
                  fontWeight: '600',
                  color: canRedo ? '#374151' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  opacity: canRedo ? 1 : 0.6,
                  transform: canRedo ? 'scale(1)' : 'scale(0.98)',
                }}
                onMouseEnter={(e) => {
                  if (canRedo) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canRedo) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <ArrowClockwise size={14} weight="bold" />
                Refazer
              </button>
            </div>
            <AIEnhanceButton
              field="summary"
              text={localData.summary || ""}
              onEnhanced={(enhancedText) => {
                const newState = { ...localData, summary: enhancedText };
                setLocalData(newState);
                setPersonalState(newState);
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
