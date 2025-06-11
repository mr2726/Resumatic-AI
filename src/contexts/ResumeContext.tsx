"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

interface ResumeData {
  jobDescription: string;
  userInput: string;
  generatedResumeHtml: string;
  isPaid: boolean;
}

interface ResumeContextType extends ResumeData {
  setJobDescription: (desc: string) => void;
  setUserInput: (input: string) => void;
  setGeneratedResumeHtml: (html: string) => void;
  setIsPaid: (paid: boolean) => void;
  resetContext: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialState: ResumeData = {
  jobDescription: '',
  userInput: '',
  generatedResumeHtml: '',
  isPaid: false,
};

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [jobDescription, setJobDescription] = useState<string>(initialState.jobDescription);
  const [userInput, setUserInput] = useState<string>(initialState.userInput);
  const [generatedResumeHtml, setGeneratedResumeHtml] = useState<string>(initialState.generatedResumeHtml);
  const [isPaid, setIsPaid] = useState<boolean>(initialState.isPaid);

  const resetContext = useCallback(() => {
    setJobDescription(initialState.jobDescription);
    setUserInput(initialState.userInput);
    setGeneratedResumeHtml(initialState.generatedResumeHtml);
    setIsPaid(initialState.isPaid);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        jobDescription,
        userInput,
        generatedResumeHtml,
        isPaid,
        setJobDescription,
        setUserInput,
        setGeneratedResumeHtml,
        setIsPaid,
        resetContext,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
}
