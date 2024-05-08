import React from 'react';
import { IHashtagData } from '../../interfaces/IHashtagData';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled, Box } from '@mui/system';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';

interface HashtagDrawerProps {
  open: boolean;
  onClose: () => void;
  hashtags: IHashtagData[];
  onHashtagSelect: (hashtag: string) => void;
  selectedHashtag: string | null;
}

interface TabItemBoxProps {
  selected?: boolean;
}

const CustomDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background-color: #1a1d2d;
    color: #9ea3b8;
    width: 250px;
  }
`;

const CustomListItemText = styled(ListItemText)`
  .MuiTypography-root {
    font-size: 0.8rem;
    font-weight: 500;
  }
  padding-left: 10px;
`;

const TabItemBox = styled(Box)<TabItemBoxProps>`
  border-radius: 20px;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(props) => (props.selected ? '#2563EB' : '#424867')};
  color: ${(props) => (props.selected ? 'white' : 'inherit')};
`;

const HashtagDrawer: React.FC<HashtagDrawerProps> = ({
  open,
  onClose,
  hashtags,
  onHashtagSelect,
  selectedHashtag,
}) => {
  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate('/learning-goal');
  };

  return (
    <CustomDrawer anchor="right" open={open} onClose={onClose}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FolderCopyIcon className="text-white text-lg" />
          <p className="text-base font-semibold text-white">All Topics</p>
        </div>
        <AddIcon
          className="text-white text-lg cursor-pointer"
          onClick={handleAddClick}
        />
      </div>
      <List>
        {hashtags.map((hashtag) => (
          <ListItem
            key={hashtag.id}
            button
            onClick={() => onHashtagSelect(hashtag.name)}
          >
            <TabItemBox selected={hashtag.name === selectedHashtag}>
              <CustomListItemText primary={hashtag.name} />
              <MoreHorizIcon />
            </TabItemBox>
          </ListItem>
        ))}
      </List>
    </CustomDrawer>
  );
};

export default HashtagDrawer;
