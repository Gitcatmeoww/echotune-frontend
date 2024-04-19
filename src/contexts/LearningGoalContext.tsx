import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// Define the type for the context state
interface LearningGoalContextType {
  learningGoal: string;
  setLearningGoal: Dispatch<SetStateAction<string>>;
  generatedTags: string[];
  setGeneratedTags: Dispatch<SetStateAction<string[]>>;
  selectedTags: Set<string>;
  setSelectedTags: Dispatch<SetStateAction<Set<string>>>;
}

// Create the context with a default value
const LearningGoalContext = createContext<LearningGoalContextType | undefined>(
  undefined,
);

// Create a custom hook for using the context
export const useLearningGoal = () => {
  const context = useContext(LearningGoalContext);
  if (!context) {
    throw new Error(
      'useLearningGoal must be used within a LearningGoalProvider',
    );
  }
  return context;
};

// Define the type for the provider props
interface LearningGoalProviderProps {
  children: ReactNode;
}

// Create the context provider component
export const LearningGoalProvider: React.FC<LearningGoalProviderProps> = ({
  children,
}) => {
  const [learningGoal, setLearningGoal] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState(new Set<string>());

  return (
    <LearningGoalContext.Provider
      value={{
        learningGoal,
        setLearningGoal,
        generatedTags,
        setGeneratedTags,
        selectedTags,
        setSelectedTags,
      }}
    >
      {children}
    </LearningGoalContext.Provider>
  );
};
