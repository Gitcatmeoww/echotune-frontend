import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Tag from './Tag';
import TagInput from './TagInput';
import SuggestedTags from './SuggestedTags';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const InterestSelection: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [interests, setInterests] = useState<string[]>(['Tech', 'LLMs']);
  const [sources, setSources] = useState<string[]>(['CNN', 'New York Times']);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Suggest Tag 1',
    'Suggest Tag 2',
    'Suggest Tag 3',
  ]);
  const [suggestedSources, setSuggestedSources] = useState<string[]>([
    'Suggest Source 1',
    'Suggest Source 2',
    'Suggest Source 3',
  ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDeleteInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleDeleteSource = (source: string) => {
    setSources(sources.filter((s) => s !== source));
  };

  const handleAddInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const handleAddSource = (source: string) => {
    if (!sources.includes(source)) {
      setSources([...sources, source]);
    }
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs
        value={tabValue}
        onChange={handleChange}
        aria-label="interests and sources tabs"
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Interests" {...a11yProps(0)} />
        <Tab label="Sources" {...a11yProps(1)} />
      </Tabs>

      {/* Interests Tab */}
      <TabPanel value={tabValue} index={0}>
        <div className="flex flex-wrap gap-2 mb-4">
          {interests.map((interest) => (
            <Tag
              key={interest}
              label={interest}
              onDelete={() => handleDeleteInterest(interest)}
            />
          ))}
        </div>

        <SuggestedTags
          tags={suggestions}
          onAddTag={(newTag) => handleAddInterest(newTag)}
        />

        <TagInput onAddTag={(newTag) => handleAddInterest(newTag)} />
      </TabPanel>
      {/* Sources Tab */}
      <TabPanel value={tabValue} index={1}>
        <div className="flex flex-wrap gap-2 mb-4">
          {sources.map((source) => (
            <Tag
              key={source}
              label={source}
              onDelete={() => handleDeleteSource(source)}
            />
          ))}
        </div>

        <SuggestedTags tags={suggestedSources} onAddTag={handleAddSource} />

        <TagInput onAddTag={handleAddSource} />
      </TabPanel>
    </Box>
  );
};

export default InterestSelection;
