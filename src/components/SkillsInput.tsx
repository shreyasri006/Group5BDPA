import { useState, useRef, useEffect } from 'react';
import type { Skill } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import './SkillsInput.css';

interface SkillsInputProps {
  skills: Skill[];
  userSkills: string[];
  onSkillsChange: (skills: string[]) => void;
}

type InputMethod = 'manual' | 'resume' | 'linkedin';

export function SkillsInput({ skills, userSkills, onSkillsChange }: SkillsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputMethod, setInputMethod] = useState<InputMethod>('manual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const normalizedInput = inputValue.toLowerCase().trim();
      const filtered = skills.filter(skill => {
        const matchesLabel = skill.label.toLowerCase().includes(normalizedInput);
        const matchesAlias = skill.aliases.some(alias => 
          alias.toLowerCase().includes(normalizedInput)
        );
        const notAlreadyAdded = !userSkills.includes(skill.id);
        return (matchesLabel || matchesAlias) && notAlreadyAdded;
      }).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, skills, userSkills]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAddSkill = (skillId?: string) => {
    const skillToAdd = skillId || inputValue.trim();
    if (skillToAdd && !userSkills.includes(skillToAdd)) {
      onSkillsChange([...userSkills, skillToAdd]);
      setInputValue('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleAddSkill(suggestions[0].id);
      } else {
        handleAddSkill();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(userSkills.filter(skill => skill !== skillToRemove));
  };

  const handleClearAll = () => {
    onSkillsChange([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (skill: Skill) => {
    handleAddSkill(skill.id);
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      // Simulate file processing (in production, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted skills (in production, this would come from an API)
      const extractedSkills = extractSkillsFromResume(file.name);
      
      // Add extracted skills that aren't already added
      const newSkills = extractedSkills.filter(skillId => !userSkills.includes(skillId));
      if (newSkills.length > 0) {
        onSkillsChange([...userSkills, ...newSkills]);
      }
      
      setInputMethod('manual');
    } catch (error) {
      setUploadError('Failed to process file. Please try manual input.');
      console.error('File processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain') {
        handleFileUpload(file);
      } else {
        setUploadError('Please upload a PDF, Word document, or text file.');
      }
    }
  };

  const handleLinkedInImport = async () => {
    setIsProcessing(true);
    setUploadError(null);

    try {
      // In production, this would integrate with LinkedIn API
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock LinkedIn skills (in production, this would come from LinkedIn API)
      const linkedInSkills = ['javascript', 'react', 'python', 'git', 'github'];
      const newSkills = linkedInSkills.filter(skillId => !userSkills.includes(skillId));
      if (newSkills.length > 0) {
        onSkillsChange([...userSkills, ...newSkills]);
      }
      
      setInputMethod('manual');
      alert('LinkedIn import feature requires API integration. Using demo data for now.');
    } catch (error) {
      setUploadError('Failed to import from LinkedIn. Please try manual input.');
      console.error('LinkedIn import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock function to extract skills from resume
  const extractSkillsFromResume = (filename: string): string[] => {
    // In production, this would use an AI service to extract skills
    // For now, return some common skills as a demo
    return ['javascript', 'python', 'html', 'css', 'git'];
  };

  return (
    <div className={`skills-input-container ${theme}`}>
      <div className="skills-input-wrapper">
        <label htmlFor="skill-input" className="skills-label">
          Your Skills
        </label>

        {/* Input Method Selection */}
        <div className="input-method-tabs">
          <button
            type="button"
            className={`method-tab ${inputMethod === 'manual' ? 'active' : ''}`}
            onClick={() => {
              setInputMethod('manual');
              setUploadError(null);
            }}
          >
            ✏️ Manual Input
          </button>
          <button
            type="button"
            className={`method-tab ${inputMethod === 'resume' ? 'active' : ''}`}
            onClick={() => {
              setInputMethod('resume');
              setUploadError(null);
              fileInputRef.current?.click();
            }}
          >
            📄 Upload Resume
          </button>
          <button
            type="button"
            className={`method-tab ${inputMethod === 'linkedin' ? 'active' : ''}`}
            onClick={() => {
              setInputMethod('linkedin');
              setUploadError(null);
              handleLinkedInImport();
            }}
          >
            💼 Import LinkedIn
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleResumeUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="processing-state">
            <div className="spinner-small" />
            <span>Processing {inputMethod === 'resume' ? 'resume' : 'LinkedIn profile'}...</span>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="error-message">
            {uploadError}
          </div>
        )}

        {/* Manual Input */}
        {inputMethod === 'manual' && (
          <div className="input-with-suggestions">
            <div className="skills-chips-container">
              {userSkills.map(skill => {
                const skillData = skills.find(s => s.id === skill);
                const displayName = skillData?.label || skill;
                return (
                  <span key={skill} className="skill-chip">
                    {displayName}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="chip-remove"
                      aria-label={`Remove ${displayName}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <input
                ref={inputRef}
                id="skill-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder={userSkills.length === 0 ? "Type a skill and press Enter..." : ""}
                className="skill-input"
              />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestionsRef} className="suggestions-dropdown">
                {suggestions.map(skill => (
                  <div
                    key={skill.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(skill)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSuggestionClick(skill);
                      }
                    }}
                    tabIndex={0}
                    role="option"
                  >
                    {skill.label}
                    <span className="suggestion-category">{skill.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Resume Upload Instructions */}
        {inputMethod === 'resume' && !isProcessing && (
          <div className="upload-instructions">
            <p>Click the "Upload Resume" button above to select your resume file.</p>
            <p className="hint">Supported formats: PDF, Word, or Text files</p>
          </div>
        )}

        {/* LinkedIn Import Instructions */}
        {inputMethod === 'linkedin' && !isProcessing && (
          <div className="upload-instructions">
            <p>Click the "Import LinkedIn" button above to import your skills from LinkedIn.</p>
            <p className="hint">This feature requires LinkedIn API integration</p>
          </div>
        )}

        {/* Skills Display */}
        {userSkills.length > 0 && (
          <div className="skills-display">
            <div className="skills-chips-container-display">
              {userSkills.map(skill => {
                const skillData = skills.find(s => s.id === skill);
                const displayName = skillData?.label || skill;
                return (
                  <span key={skill} className="skill-chip">
                    {displayName}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="chip-remove"
                      aria-label={`Remove ${displayName}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <button
              type="button"
              onClick={handleClearAll}
              className="clear-all-button"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
      {inputMethod === 'manual' && (
        <p className="input-hint">
          Start typing to see suggestions. Press Enter to add a skill.
        </p>
      )}
    </div>
  );
}
