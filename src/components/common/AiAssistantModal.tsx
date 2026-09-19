import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Minimize2,
  Minus,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Calculator,
  Coins,
  Receipt,
  Tag,
  Boxes,
  Users,
  Calendar,
  Flame,
  UserPlus,
  BookOpen,
  Search,
  Globe,
  Play,
  Square,
  Zap,
  Code2,
  Check,
  Building2,
  Package,
} from 'lucide-react';
import {
  TaskType,
  TASK_WORKFLOWS,
  WorkflowStep,
  ErpContext,
  ChatMessage,
  ChatLanguage,
  ChatTableData,
  AiChatbotEngine,
} from '../../services/aiChatbotService';
import {
  AccountMaster,
  NewOrderBookingRecord,
  RefineryRecord,
  PurchaseRecord,
  DayBookEntry,
  SundryDebtorRow,
  StockItem,
} from '../../types/erp';
import { formatCurrency, formatWeight } from '../../utils/calculations';
import { useTheme } from '../../context/ThemeContext';
import { semanticRouter } from '../../services/semanticRouterService';
import { AiAnalyticsCards } from '../ai/AiAnalyticsCard';
import { AiDataGrid } from '../ai/AiDataGrid';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: ErpContext;
  onSavePurchase: (record: PurchaseRecord) => void;
  onSaveOrder: (record: NewOrderBookingRecord) => void;
  onSaveAccount: (account: AccountMaster) => void;
  onSaveRefinery: (record: RefineryRecord) => void;
  onAddItemToStock: (item: StockItem) => void;
  onAddDayBookEntry?: (entry: DayBookEntry) => void;
  onNavigate: (section: string, subView?: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  context,
  onSavePurchase,
  onSaveOrder,
  onSaveAccount,
  onSaveRefinery,
  onAddItemToStock,
  onAddDayBookEntry,
  onNavigate,
}) => {
  const { currentTheme, isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [autoSpeakAudio, setAutoSpeakAudio] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<ChatLanguage>('auto');

  // Active step-by-step workflow state
  const [activeTask, setActiveTask] = useState<{
    taskType: TaskType;
    stepIndex: number;
    collectedData: Record<string, any>;
  } | null>(null);

  // Active step input buffer
  const [stepInputValue, setStepInputValue] = useState<any>('');
  const [stepError, setStepError] = useState<string | null>(null);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'bot',
      language: 'en',
      text: `👋 Welcome to **Swarna AI ERP Copilot**!
Powered by **LLM Function Calling & Semantic Intent Recognition**.

Ask any full-sentence query or command:
- 📊 *"What were our total sales and average order values today?"*
- 🏢 *"Find supplier Rajesh"* or *"Check balance for Mahalaxmi Silver"*
- 📋 *"Where is order ORD-2026-108 and what is the delivery date?"*
- 🚀 *"Take me to Sales POS"* or *"Open Day Book"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickChips: [
        { label: '📊 Today’s Sales Turnover', action: 'query', payload: 'What were our total sales today?' },
        { label: '🏢 Find Supplier Rajesh', action: 'query', payload: 'Find supplier Rajesh' },
        { label: '📋 Track Order ORD-2026-108', action: 'query', payload: 'Track order ORD-2026-108' },
        { label: '🚀 Open Sales POS (F4)', action: 'navigate', payload: { section: 'transactions', subView: 'sales_invoice' } },
        { label: '🛒 Open Purchase (F5)', action: 'navigate', payload: { section: 'transactions', subView: 'purchase' } },
        { label: '💵 Open Day Book (F10)', action: 'navigate', payload: { section: 'accounts', subView: 'day_book' } },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize and keep engine synced with live ERP context
  const engine = useMemo(() => new AiChatbotEngine(context), []);
  useEffect(() => {
    engine.updateContext(context);
  }, [context, engine]);

  // Text-To-Speech (TTS Audio Response)
  const speakText = (text: string, langHint: 'en' | 'mr' | 'hi' = 'en') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Strip markdown characters from speech text
    const cleanText = text
      .replace(/[*_#`$]/g, '')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const targetLang = langHint === 'mr' ? 'mr-IN' : langHint === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.lang = targetLang;

    // Try to pick an appropriate voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.includes(targetLang) || v.lang.includes('hi') || v.lang.includes('IN'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTask, isThinking]);

  // Global Escape key listener to cleanly close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        stopSpeaking();
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !activeTask) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, activeTask]);

  // Initialize step input value when step changes
  useEffect(() => {
    if (activeTask) {
      const workflow = TASK_WORKFLOWS[activeTask.taskType];
      const step = workflow.steps[activeTask.stepIndex];
      if (step) {
        let def: string | number = '';
        if (typeof step.defaultValue === 'function') {
          def = step.defaultValue(activeTask.collectedData, context);
        } else if (step.defaultValue !== undefined) {
          def = step.defaultValue;
        }
        setStepInputValue(activeTask.collectedData[step.field] ?? def);
        setStepError(null);

        // Auto speak question if TTS enabled
        if (autoSpeakAudio) {
          const effectiveLang = selectedLanguage === 'mr' ? 'mr' : selectedLanguage === 'hi' ? 'hi' : 'en';
          const qText = effectiveLang === 'mr' && step.questionMr ? step.questionMr : effectiveLang === 'hi' && step.questionHi ? step.questionHi : step.question;
          speakText(qText, effectiveLang);
        }
      }
    }
  }, [activeTask, context, autoSpeakAudio, selectedLanguage]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set recognition language
    const recLang = selectedLanguage === 'mr' ? 'mr-IN' : selectedLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.lang = recLang;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputVal(transcript);
      setIsListening(false);
      // Auto-submit voice command
      setTimeout(() => {
        handleProcessInput(transcript);
      }, 100);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, selectedLanguage]);

  // Handle start of a task workflow
  const startWorkflow = (taskType: TaskType) => {
    const workflow = TASK_WORKFLOWS[taskType];
    if (!workflow) return;

    const firstStep = workflow.steps[0];
    let initialDef: string | number = '';
    if (typeof firstStep.defaultValue === 'function') {
      initialDef = firstStep.defaultValue({}, context);
    } else if (firstStep.defaultValue !== undefined) {
      initialDef = firstStep.defaultValue;
    }

    setActiveTask({
      taskType,
      stepIndex: 0,
      collectedData: {},
    });
    setStepInputValue(initialDef);
    setStepError(null);

    const isMr = selectedLanguage === 'mr';
    const isHi = selectedLanguage === 'hi';
    const startMsg = isMr
      ? `**${workflow.name}** सुरू करत आहे (${workflow.steps.length} टप्पे).\nमी तुम्हाला १-१ प्रश्न विचारत आहे:`
      : isHi
      ? `**${workflow.name}** शुरू कर रहे हैं (${workflow.steps.length} चरण)।\nकृपया १-१ सवाल का जवाब दें:`
      : `Starting **${workflow.name}** (${workflow.steps.length} steps).\nI will ask you 1 question at a time:`;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        language: isMr ? 'mr' : isHi ? 'hi' : 'en',
        text: startMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (autoSpeakAudio) {
      speakText(startMsg, isMr ? 'mr' : isHi ? 'hi' : 'en');
    }
  };

  // Submit current step in active task
  const handleStepSubmit = (customVal?: any) => {
    if (!activeTask) return;
    const workflow = TASK_WORKFLOWS[activeTask.taskType];
    const currentStep = workflow.steps[activeTask.stepIndex];
    const val = customVal !== undefined ? customVal : stepInputValue;

    // Validate
    if (currentStep.validate) {
      const res = currentStep.validate(val, activeTask.collectedData);
      if (!res.valid) {
        setStepError(res.error || 'Invalid value entered.');
        return;
      }
    }

    // Compute derived fields if any
    let updatedData = { ...activeTask.collectedData, [currentStep.field]: val };
    if (currentStep.computeDerived) {
      const derived = currentStep.computeDerived(val, updatedData, context);
      updatedData = { ...updatedData, ...derived };
    }

    const nextIndex = activeTask.stepIndex + 1;

    // Log user answer in message feed
    setMessages((prev) => [
      ...prev,
      {
        id: `user-step-${Date.now()}`,
        sender: 'user',
        text: `${currentStep.question}\n**उत्तर / Answer:** ${val}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (nextIndex < workflow.steps.length) {
      // Proceed to next step
      setActiveTask({
        taskType: activeTask.taskType,
        stepIndex: nextIndex,
        collectedData: updatedData,
      });
    } else {
      // All steps completed! Execute the task
      setActiveTask(null);
      const executionResult = engine.executeTask(
        activeTask.taskType,
        updatedData,
        {
          onSavePurchase,
          onSaveOrder,
          onSaveAccount,
          onSaveRefinery,
          onAddItemToStock,
          onAddDayBookEntry,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-exec-${Date.now()}`,
          sender: 'bot',
          text: executionResult.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          cardData: executionResult.cardData,
          quickChips: [
            { label: '🛒 New Purchase', action: 'start_task', payload: 'purchase_inward' },
            { label: '🏷️ Barcode Tag', action: 'start_task', payload: 'barcode_generate' },
            { label: '💰 Sales POS', action: 'start_task', payload: 'sales_invoice' },
            { label: '📦 Check Stock', action: 'query', payload: 'What is our total gold stock?' },
          ],
        },
      ]);

      if (autoSpeakAudio) {
        speakText(executionResult.message, 'mr');
      }
    }
  };

  // Step Back
  const handleStepBack = () => {
    if (!activeTask || activeTask.stepIndex === 0) return;
    setActiveTask({
      ...activeTask,
      stepIndex: activeTask.stepIndex - 1,
    });
  };

  // Cancel Task
  const handleCancelTask = () => {
    setActiveTask(null);
    setMessages((prev) => [
      ...prev,
      {
        id: `cancel-${Date.now()}`,
        sender: 'bot',
        text: 'Workflow cancelled. How else can I assist you?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickChips: [
          { label: '📊 Sales Turnover', action: 'query', payload: 'What were our total sales today?' },
          { label: '🏢 Find Supplier', action: 'query', payload: 'Find supplier Rajesh' },
          { label: '📋 Track Order', action: 'query', payload: 'Track order ORD-2026-108' },
        ],
      },
    ]);
  };

  // Process text or voice input via Semantic LLM Function Calling Router
  const handleProcessInput = async (userText: string) => {
    if (!userText.trim()) return;

    // Check if direct task workflow command
    const lower = userText.toLowerCase();
    if (lower === 'start purchase' || lower === 'new purchase') {
      startWorkflow('purchase_inward');
      return;
    }
    if (lower === 'start barcode' || lower === 'new barcode') {
      startWorkflow('barcode_generate');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      // Execute Semantic LLM Router with full-sentence understanding & Function Calling
      const result = await semanticRouter.processUserMessage(
        userText,
        [...messages, userMsg],
        context
      );

      // Programmatic Client Navigation Execution
      if (result.clientNavigation) {
        onNavigate(result.clientNavigation.section, result.clientNavigation.subView);
      }

      const botMsg: ChatMessage = {
        id: result.messageId || `bot-${Date.now()}`,
        sender: 'bot',
        language: selectedLanguage === 'auto' ? 'en' : selectedLanguage,
        text: result.text,
        timestamp: result.timestamp,
        toolCallExecuted: result.toolCallExecuted,
        summaryCards: result.summaryCards,
        tableData: result.tableData,
        isDisambiguation: result.isDisambiguation,
        disambiguationPrompt: result.disambiguationPrompt,
        disambiguationOptions: result.disambiguationOptions,
        clientNavigation: result.clientNavigation,
        quickChips: result.quickChips,
      };

      setMessages((prev) => [...prev, botMsg]);

      if (autoSpeakAudio) {
        speakText(result.text, selectedLanguage === 'auto' ? 'en' : selectedLanguage);
      }
    } catch (err) {
      console.error('Semantic router error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: `I encountered an issue processing your request. Please try again or rephrase.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    const textToSend = inputVal.trim();
    setInputVal('');
    handleProcessInput(textToSend);
  };

  // Quick Action Chip Click
  const handleChipClick = (chip: { label: string; action: string; payload?: any }) => {
    if (chip.action === 'start_task' && chip.payload) {
      startWorkflow(chip.payload as TaskType);
    } else if (chip.action === 'query' && chip.payload) {
      handleProcessInput(chip.payload);
    } else if (chip.action === 'navigate' && chip.payload) {
      onNavigate(chip.payload.section, chip.payload.subView);
    }
  };

  if (!isOpen) return null;

  const currentWorkflow = activeTask ? TASK_WORKFLOWS[activeTask.taskType] : null;
  const currentStep = currentWorkflow ? currentWorkflow.steps[activeTask!.stepIndex] : null;

  const stepQuestionText = currentStep
    ? (selectedLanguage === 'mr' && currentStep.questionMr
        ? currentStep.questionMr
        : selectedLanguage === 'hi' && currentStep.questionHi
        ? currentStep.questionHi
        : currentStep.question)
    : '';

  // Minimized Floating Pill Bar Dock
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 pointer-events-auto select-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-3">
        <div
          className={`flex items-center space-x-3 px-4 py-2.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all ${
            isDark
              ? 'bg-[#0f172a]/95 border-amber-400/50 text-white shadow-black/80 ring-1 ring-amber-400/20'
              : 'bg-white/95 border-sky-300 text-slate-800 shadow-xl shadow-sky-950/10'
          }`}
        >
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center space-x-2.5 cursor-pointer text-left hover:opacity-90 transition-opacity"
            title="Click to Restore Copilot Window"
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-xs tracking-wide">Swarna AI Copilot</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                  Active
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium max-w-[180px] truncate">
                {activeTask ? `Task: ${currentWorkflow?.name}` : 'Click to reopen chat'}
              </span>
            </div>
          </button>

          <div className="flex items-center space-x-1 border-l pl-2.5 border-slate-200 dark:border-white/10">
            <button
              onClick={() => setIsMinimized(false)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Restore Window"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                setIsMinimized(false);
                onClose();
              }}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white transition-all cursor-pointer font-bold"
              title="Close Copilot (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-end p-2 sm:p-4 md:p-5 pointer-events-none overflow-hidden select-none">
      {/* Universal Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/35 backdrop-blur-xs pointer-events-auto transition-opacity"
        onClick={() => {
          stopSpeaking();
          onClose();
        }}
        title="Click outside to close (Esc)"
      />

      {/* Main Copilot Drawer Container */}
      <div
        className={`pointer-events-auto flex flex-col rounded-2xl sm:rounded-3xl shadow-2xl border transition-all duration-300 overflow-hidden relative z-10 ${
          isExpanded
            ? 'w-full sm:w-[840px] md:w-[960px] lg:w-[1080px] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] h-[min(780px,calc(100dvh-2.5rem))] max-h-[calc(100dvh-1.5rem)]'
            : 'w-full sm:w-[540px] md:w-[600px] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] h-[min(660px,calc(100dvh-2.5rem))] max-h-[calc(100dvh-1.5rem)]'
        } ${
          isDark
            ? 'bg-[#0f172a]/95 backdrop-blur-2xl border-white/20 text-white shadow-2xl shadow-black/80'
            : 'bg-white/95 backdrop-blur-xl border-sky-200/90 text-slate-800 shadow-2xl shadow-sky-950/20'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`px-3 sm:px-4 py-2.5 sm:py-3 border-b flex items-center justify-between shrink-0 ${
            isDark
              ? 'bg-[#0b1120] border-white/10'
              : 'bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white border-blue-900'
          }`}
        >
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 shadow-md shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs sm:text-sm tracking-wide">Swarna AI Copilot</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Function Calling Engine</span>
                </span>
              </div>
              <span className={`text-[10px] sm:text-[11px] block font-medium truncate max-w-[180px] sm:max-w-xs ${isDark ? 'text-slate-400' : 'text-blue-100'}`}>
                Semantic Reasoning • Analytics Cards • Dynamic Tables
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Audio Voice Output Toggle (TTS) */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                } else {
                  setAutoSpeakAudio(!autoSpeakAudio);
                }
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                autoSpeakAudio || isSpeaking
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : isDark
                  ? 'hover:bg-white/10 text-slate-400'
                  : 'hover:bg-white/20 text-white/80'
              }`}
              title={autoSpeakAudio ? 'Audio Voice: ON' : 'Enable Voice Audio'}
            >
              {isSpeaking ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-bounce" /> : autoSpeakAudio ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Reset / Clear */}
            <button
              onClick={() => {
                stopSpeaking();
                setActiveTask(null);
                setMessages([
                  {
                    id: 'reset-msg',
                    sender: 'bot',
                    text: 'Chat history cleared. How can I assist you with your sales, vendors, or orders?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    quickChips: [
                      { label: '📊 Today’s Sales Turnover', action: 'query', payload: 'What were our total sales today?' },
                      { label: '🏢 Find Supplier Rajesh', action: 'query', payload: 'Find supplier Rajesh' },
                      { label: '📋 Track Order ORD-2026-108', action: 'query', payload: 'Track order ORD-2026-108' },
                    ],
                  },
                ]);
              }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-white/20 text-white/80'
              }`}
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Expand / Collapse Full Width */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer hidden sm:block ${
                isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-white/20 text-white/80'
              }`}
              title={isExpanded ? 'Standard Width' : 'Expand Full Width'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Minimize to Floating Bar */}
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-white/20 text-white'
              }`}
              title="Minimize to Floating Bar"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-600 text-white transition-all cursor-pointer font-bold shadow-xs flex items-center justify-center"
              title="Close Copilot (Esc)"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-end space-x-2 max-w-[98%] sm:max-w-[94%]">
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs mb-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl shadow-xs leading-relaxed w-full ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-xs whitespace-pre-line'
                      : isDark
                      ? 'bg-white/10 border border-white/15 text-slate-100 rounded-bl-xs'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 rounded-bl-xs'
                  }`}
                >
                  {/* Tool Call Executed Badge */}
                  {msg.toolCallExecuted && (
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 mb-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-700 dark:text-blue-300 text-[10px] font-mono font-bold">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>LLM Tool Executed:</span>
                      <span className="font-black text-blue-900 dark:text-blue-100">
                        {msg.toolCallExecuted.toolName}()
                      </span>
                    </div>
                  )}

                  {/* Markdown / Response Text */}
                  <div className="space-y-1.5 whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </div>

                  {/* Analytics Summary Cards */}
                  {msg.summaryCards && msg.summaryCards.length > 0 && (
                    <AiAnalyticsCards cards={msg.summaryCards} />
                  )}

                  {/* Interactive Dynamic Data Grid */}
                  {msg.tableData && (
                    <AiDataGrid tableData={msg.tableData} onNavigate={onNavigate} />
                  )}

                  {/* Disambiguation Choice Chips */}
                  {msg.isDisambiguation && msg.disambiguationOptions && msg.disambiguationOptions.length > 0 && (
                    <div className="my-3 p-3 rounded-2xl border border-amber-300/80 bg-amber-50/70 dark:bg-amber-950/30 dark:border-amber-500/30 space-y-2">
                      <span className="text-[11px] font-bold text-amber-950 dark:text-amber-200 block">
                        {msg.disambiguationPrompt || 'Multiple records found. Please choose an option:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.disambiguationOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleProcessInput(opt.payload)}
                            className="p-2.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-100/80 dark:bg-white/10 dark:hover:bg-white/20 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                                {opt.title}
                              </span>
                              {opt.badge && (
                                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                  {opt.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[10.5px] text-slate-500 dark:text-slate-300 mt-0.5">
                              {opt.subtitle}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Client Navigation Notification */}
                  {msg.clientNavigation && (
                    <div className="my-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-900 dark:text-emerald-300 flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Redirected to {msg.clientNavigation.screenName} ({msg.clientNavigation.shortcut})</span>
                      </div>
                      <button
                        onClick={() => onNavigate(msg.clientNavigation!.section, msg.clientNavigation!.subView)}
                        className="px-2.5 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-bold cursor-pointer"
                      >
                        Re-open ↗
                      </button>
                    </div>
                  )}

                  {/* Follow-up Quick Action Chips */}
                  <div className="mt-3 pt-2 border-t border-slate-200/30 flex items-center justify-between flex-wrap gap-1.5">
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakText(msg.text, msg.language || 'en')}
                        className={`text-[10px] px-2 py-0.5 rounded-md flex items-center space-x-1 font-medium transition-colors cursor-pointer ${
                          isDark ? 'bg-white/10 hover:bg-white/20 text-amber-300' : 'bg-slate-200/70 hover:bg-slate-300 text-slate-700'
                        }`}
                        title="Listen to this message"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    )}

                    {msg.quickChips && msg.quickChips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickChips.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChipClick(chip)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                              isDark
                                ? 'bg-white/15 hover:bg-white/25 text-amber-300 border border-white/20'
                                : 'bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 shadow-2xs'
                            }`}
                          >
                            <span>{chip.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-8 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Thinking / Tool Evaluation Loading Indicator */}
          {isThinking && (
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-900 dark:text-blue-200 max-w-sm animate-pulse">
              <Bot className="w-4 h-4 text-blue-600 animate-spin" />
              <div className="text-xs">
                <span className="font-bold block">Evaluating Intent & Function Tools...</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Context reasoning in progress</span>
              </div>
            </div>
          )}

          {/* ACTIVE STEP WORKFLOW CARD */}
          {activeTask && currentWorkflow && currentStep && (
            <div
              className={`p-4 rounded-2xl border shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                isDark
                  ? 'bg-[#1e293b]/95 border-amber-400/40 text-white'
                  : 'bg-gradient-to-br from-amber-50/90 to-sky-50/90 border-amber-300 text-slate-900 shadow-md'
              }`}
            >
              {/* Step Progress Tracker */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-200/60 dark:border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{currentWorkflow.icon}</span>
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      {currentWorkflow.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Question {activeTask.stepIndex + 1} of {currentWorkflow.steps.length}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className="w-24 bg-slate-200 dark:bg-white/20 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-blue-600 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${((activeTask.stepIndex + 1) / currentWorkflow.steps.length) * 100}%`,
                      }}
                    />
                  </div>
                  <button
                    onClick={handleCancelTask}
                    className="text-[10px] px-1.5 py-0.5 rounded text-rose-600 hover:bg-rose-100 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Step Question Prompt */}
              <div className="space-y-1 mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <span>{stepQuestionText}</span>
                </h4>
                {currentStep.subtext && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentStep.subtext}
                  </p>
                )}
              </div>

              {/* Step Input Field */}
              <div className="space-y-2 mb-3">
                {currentStep.type === 'select' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {currentStep.options?.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => {
                          setStepInputValue(opt.value);
                          handleStepSubmit(opt.value);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          stepInputValue === opt.value
                            ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                            : isDark
                            ? 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
                            : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="font-bold text-xs">{opt.label}</span>
                        {opt.sub && (
                          <span
                            className={`text-[10px] ${
                              stepInputValue === opt.value
                                ? 'text-blue-100'
                                : 'text-slate-400'
                            }`}
                          >
                            {opt.sub}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          autoFocus
                          type={currentStep.type === 'date' ? 'date' : currentStep.type === 'weight' || currentStep.type === 'currency' || currentStep.type === 'number' ? 'number' : 'text'}
                          step={currentStep.type === 'weight' ? '0.001' : '1'}
                          placeholder={currentStep.placeholder}
                          value={stepInputValue}
                          onChange={(e) => {
                            setStepInputValue(e.target.value);
                            setStepError(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleStepSubmit();
                            }
                          }}
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-medium outline-hidden transition-all ${
                            stepError
                              ? 'border-rose-500 ring-2 ring-rose-300'
                              : isDark
                              ? 'bg-black/30 border-white/20 text-white focus:border-amber-400'
                              : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                          }`}
                        />
                        {currentStep.type === 'weight' && (
                          <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                            Grams
                          </span>
                        )}
                        {currentStep.type === 'currency' && (
                          <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono">
                            ₹ INR
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStepSubmit()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {stepError && (
                  <div className="flex items-center space-x-1 text-rose-600 text-[11px] font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{stepError}</span>
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/50 dark:border-white/10 text-[11px]">
                <button
                  type="button"
                  disabled={activeTask.stepIndex === 0}
                  onClick={handleStepBack}
                  className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                    activeTask.stepIndex === 0
                      ? 'text-slate-400 opacity-50 cursor-not-allowed'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/20 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStepSubmit()}
                  className="text-blue-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  Accept Default &rarr;
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Area */}
        <div
          className={`p-3 border-t shrink-0 ${
            isDark ? 'bg-[#0b1120] border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse ring-4 ring-rose-200'
                  : isDark
                  ? 'bg-white/10 text-slate-300 hover:bg-white/20 border-white/15'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
              }`}
              title={isListening ? 'Listening...' : 'Voice Speech Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  activeTask
                    ? 'Workflow in progress above...'
                    : 'Ask anything (e.g. "total sales today", "find supplier Rajesh", "track order ORD-2026-108")...'
                }
                disabled={Boolean(activeTask) || isThinking}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-hidden transition-all ${
                  isDark
                    ? 'bg-white/10 border-white/15 text-white placeholder:text-slate-500 focus:border-amber-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white'
                } disabled:opacity-50`}
              />
            </div>

            <button
              type="submit"
              disabled={!inputVal.trim() || Boolean(activeTask) || isThinking}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 text-white shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Micro Helper Bar */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Full-Sentence Semantic Function Calling Active</span>
            </span>
            <div className="flex items-center space-x-2 font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-semibold">
                Esc: Close
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                Ctrl+Space
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
