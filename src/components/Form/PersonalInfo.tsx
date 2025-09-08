// Formulário de dados pessoais (com import de tipos e progresso tipado)
import React, { useState } from "react";
import type {
  PersonalInfo as PersonalInfoType,
  CVDataActions,
} from "../../types/cv.types";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateLinkedIn,
  validateSummary,
  formatPhone,
} from "../../utils/validation";

interface PersonalInfoProps {
  data: PersonalInfoType;
  actions: CVDataActions;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  summary?: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, actions }) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const SUMMARY_MAX_LENGTH = 500;

  function validateField(field: keyof PersonalInfoType, value: string) {
    let validation;
    switch (field) {
      case "name":
        validation = validateName(value);
        break;
      case "email":
        validation = validateEmail(value);
        break;
      case "phone":
        validation = validatePhone(value);
        break;
      case "linkedin":
        validation = validateLinkedIn(value);
        break;
      case "summary":
        validation = validateSummary(value, SUMMARY_MAX_LENGTH);
        break;
      default:
        validation = { isValid: true };
    }
    setErrors((prev) => ({ ...prev, [field]: validation.error }));
    return validation.isValid;
  }

  function handleFieldChange(field: keyof PersonalInfoType, value: string) {
    actions.updatePersonalInfo(field, value);
  }

  function handleFieldBlur(field: keyof PersonalInfoType) {
    if (field === "phone" && data[field]) {
      const formatted = formatPhone(data[field]);
      if (formatted !== data[field])
        actions.updatePersonalInfo(field, formatted);
    }
    validateField(field, data[field]);
  }

  const InputField: React.FC<{
    label: string;
    field: keyof PersonalInfoType;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }> = ({ label, field, type = "text", placeholder, required = false }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={data[field]}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        onBlur={() => handleFieldBlur(field)}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  const filledCount = [
    data.name,
    data.email,
    data.phone,
    data.linkedin,
    data.summary,
  ].filter((v) => v.trim() !== "").length;
  const progress = Math.round((filledCount / 5) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Dados Pessoais
        </h2>

        <div className="space-y-4">
          <InputField
            label="Nome Completo"
            field="name"
            placeholder="Digite seu nome completo"
            required
          />
          <InputField
            label="Email"
            field="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            required
          />
          <InputField
            label="Telefone"
            field="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            required
          />
          <InputField
            label="LinkedIn"
            field="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/seuperfil"
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resumo Profissional <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.summary}
              onChange={(e) => handleFieldChange("summary", e.target.value)}
              onBlur={() => handleFieldBlur("summary")}
              placeholder="Descreva brevemente sua experiência profissional..."
              rows={4}
              maxLength={SUMMARY_MAX_LENGTH}
              autoComplete="off"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                errors.summary ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              <div>
                {errors.summary && (
                  <p className="text-sm text-red-600">{errors.summary}</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {data.summary.length}/{SUMMARY_MAX_LENGTH}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progresso do preenchimento:</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
