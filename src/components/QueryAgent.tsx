import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Globe, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SearchResult {
  title: string;
  url: string;
}

interface QueryHistory {
  query: string;
  results: SearchResult[];
  summary: string;
  timestamp: Date;
}

const SAMPLE_PROMPTS = [
  "Best places to visit in Delhi",
  "How to learn React in 2024",
  "Latest AI developments",
  "Climate change solutions",
  "Healthy breakfast recipes"
];

const LoadingAnimation = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center space-y-6 py-16"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-2 border-primary/30 border-t-primary rounded-full"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-2 bg-primary/20 rounded-full blur-sm"
      />
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center space-y-2"
    >
      <h3 className="text-xl font-semibold text-primary">AI is thinking</h3>
      <p className="text-muted-foreground typing-dots">Analyzing your query</p>
    </motion.div>
  </motion.div>
);

const HeroSection = ({ onSearch, isLoading }: { onSearch: (query: string) => void; isLoading: boolean }) => {
  const [query, setQuery] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="p-3 glass glass-hover rounded-2xl"
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-5xl font-bold text-gradient">Query Agent</h1>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered search assistant. Ask anything and get intelligent summaries from across the web.
        </p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-2xl space-y-6"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask me anything...`}
            className="pl-12 pr-4 py-6 text-lg glass glass-hover border-glass-border bg-glass/50 focus:bg-glass/70 focus:border-primary/50 transition-all duration-300"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-glow disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              'Search'
            )}
          </Button>
        </div>

        <motion.div
          key={currentPrompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-muted-foreground"
        >
          Try: "{SAMPLE_PROMPTS[currentPrompt]}"
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

const InvalidQueryMessage = ({ onBack }: { onBack: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
  >
    <div className="glass glass-hover rounded-2xl p-8 max-w-md mx-auto">
      <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-4">Hmm, that doesn't look like something I can search.</h3>
      <p className="text-muted-foreground mb-6">
        I'm designed to help you find information from the web. Try asking about topics, facts, or questions that need research.
      </p>
      <Button onClick={onBack} variant="outline" className="glass-hover">
        Try Another Query
      </Button>
    </div>
  </motion.div>
);

const ResultsSection = ({ 
  query, 
  results, 
  summary, 
  onBack, 
  onNewSearch 
}: { 
  query: string;
  results: SearchResult[];
  summary: string;
  onBack: () => void;
  onNewSearch: (query: string) => void;
}) => {
  const [newQuery, setNewQuery] = useState('');

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuery.trim()) {
      onNewSearch(newQuery.trim());
      setNewQuery('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen px-4 py-8"
    >
      {/* Header with new search */}
      <div className="max-w-4xl mx-auto mb-8">
        <motion.form
          onSubmit={handleNewSearch}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              placeholder="Ask another question..."
              className="pl-12 pr-4 py-3 glass glass-hover border-glass-border bg-glass/50 focus:bg-glass/70"
            />
          </div>
          <Button 
            type="submit" 
            disabled={!newQuery.trim()}
            className="bg-primary hover:bg-primary/90 px-6 hover:shadow-glow"
          >
            Search
          </Button>
        </motion.form>
      </div>

      {/* Current Query Results */}
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-2">Results for: "{query}"</h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Found {results.length} sources
          </p>
        </motion.div>

        {/* Source Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold">Sources</h3>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass glass-hover p-4 border-glass-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground line-clamp-1">{result.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{result.url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.url, '_blank')}
                      className="ml-4 hover:bg-primary/10"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Summary
          </h3>
          <Card className="glass glass-hover p-6 border-glass-border">
            <p className="text-foreground leading-relaxed">{summary}</p>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function QueryAgent() {
  const [currentView, setCurrentView] = useState<'hero' | 'loading' | 'results' | 'invalid'>('hero');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentResults, setCurrentResults] = useState<SearchResult[]>([]);
  const [currentSummary, setCurrentSummary] = useState('');
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>([]);

  // Mock validation - basic check for searchable queries
  const isValidQuery = (query: string): boolean => {
    const invalidPatterns = [
      /^(add|create|make|set|delete|remove)\s/i,
      /^(what is|what's)\s*\d+\s*[\+\-\*\/]\s*\d+/i,
      /^(hello|hi|hey|good morning|good evening)/i
    ];
    
    return !invalidPatterns.some(pattern => pattern.test(query)) && query.length > 3;
  };

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);

    // Check if query is valid
    if (!isValidQuery(query)) {
      setCurrentView('invalid');
      return;
    }

    // Check history for similar queries
    const existingQuery = queryHistory.find(
      h => h.query.toLowerCase() === query.toLowerCase()
    );

    if (existingQuery) {
      setCurrentResults(existingQuery.results);
      setCurrentSummary(existingQuery.summary);
      setCurrentView('results');
      return;
    }

    setCurrentView('loading');

    // Simulate API call with mock data
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        { title: `Comprehensive Guide to ${query}`, url: `https://example.com/guide-${query.replace(/\s+/g, '-')}` },
        { title: `Latest Updates on ${query}`, url: `https://news.example.com/${query.replace(/\s+/g, '-')}` },
        { title: `Expert Analysis: ${query}`, url: `https://expert.example.com/analysis-${query.replace(/\s+/g, '-')}` },
        { title: `${query} - Complete Overview`, url: `https://overview.example.com/${query.replace(/\s+/g, '-')}` },
        { title: `Research and Insights on ${query}`, url: `https://research.example.com/${query.replace(/\s+/g, '-')}` }
      ];

      const mockSummary = `Based on current web sources, ${query} is a complex topic with multiple perspectives. Recent research shows significant developments in this area, with experts highlighting key trends and practical applications. The information gathered from reliable sources suggests that understanding ${query} requires considering various factors and staying updated with the latest findings. This synthesis provides a comprehensive overview while acknowledging the evolving nature of the subject.`;

      setCurrentResults(mockResults);
      setCurrentSummary(mockSummary);
      
      // Add to history
      const newHistoryItem: QueryHistory = {
        query,
        results: mockResults,
        summary: mockSummary,
        timestamp: new Date()
      };
      setQueryHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10 queries

      setCurrentView('results');
    }, 2000);
  };

  const handleBack = () => {
    setCurrentView('hero');
    setCurrentQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === 'hero' && (
          <HeroSection 
            key="hero"
            onSearch={handleSearch} 
            isLoading={false} 
          />
        )}
        
        {currentView === 'loading' && (
          <LoadingAnimation key="loading" />
        )}
        
        {currentView === 'invalid' && (
          <InvalidQueryMessage key="invalid" onBack={handleBack} />
        )}
        
        {currentView === 'results' && (
          <ResultsSection
            key="results"
            query={currentQuery}
            results={currentResults}
            summary={currentSummary}
            onBack={handleBack}
            onNewSearch={handleSearch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}