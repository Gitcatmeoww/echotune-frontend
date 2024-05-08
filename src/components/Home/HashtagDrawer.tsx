import React, { useState, useEffect } from 'react';
import { IHashtagData } from '../../interfaces/IHashtagData';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';
import Box, { BoxProps } from '@mui/material/Box';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

interface HashtagDrawerProps {
  open: boolean;
  onClose: () => void;
  hashtags: IHashtagData[];
  onHashtagSelect: (hashtag: string) => void;
  selectedHashtag: string | null;
  onDeleteHashtag: (hashtagId: number) => void;
}

interface TabItemBoxProps {
  selected?: boolean;
}

interface ActionButtonBoxProps extends BoxProps {
  color: string;
}

const CustomDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    background-color: #1a1d2d;
    color: white;
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
  border-radius: 30px;
  padding: 2px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: ${(props) => (props.selected ? '#2563EB' : '#424867')};
  color: ${(props) => (props.selected ? 'white' : 'inherit')};
`;

const ActionBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  background-color: transparent;
  padding: 2px 16px;
  width: 100%;
`;

const ActionButtonBox = styled(Box)<ActionButtonBoxProps>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.color};
  margin: 2px;
  border-radius: 10px;
`;

const HashtagDrawer: React.FC<HashtagDrawerProps> = ({
  open,
  onClose,
  hashtags,
  onHashtagSelect,
  selectedHashtag,
  onDeleteHashtag,
}) => {
  const navigate = useNavigate();
  const handleAddClick = () => {
    navigate('/learning-goal');
  };

  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const [localHashtags, setLocalHashtags] = useState<IHashtagData[]>(hashtags);

  useEffect(() => {
    setLocalHashtags(hashtags);
  }, [hashtags]);

  const toggleExpand = (
    event: React.MouseEvent<HTMLButtonElement>,
    hashtag: string,
  ) => {
    event.stopPropagation();
    setExpandedTab(expandedTab === hashtag ? null : hashtag);
  };

  const handleDelete = (hashtagId: number) => {
    onDeleteHashtag(hashtagId);
    setExpandedTab(null); // Close the expanded tab if open
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
        {localHashtags.map((hashtag) => (
          <React.Fragment key={hashtag.id}>
            <ListItem button onClick={() => onHashtagSelect(hashtag.name)}>
              <TabItemBox>
                <CustomListItemText primary={hashtag.name} />
                <IconButton
                  onClick={(event) => toggleExpand(event, hashtag.name)}
                >
                  <MoreHorizIcon style={{ color: '#9ea3b8' }} />
                </IconButton>
              </TabItemBox>
            </ListItem>
            {expandedTab === hashtag.name && (
              <ActionBox>
                <ActionButtonBox color="#252A41">
                  <IconButton
                    onClick={() => console.log('Edit:', hashtag.name)}
                  >
                    <EditOutlinedIcon style={{ color: 'white' }} />
                  </IconButton>
                </ActionButtonBox>
                <ActionButtonBox color="#252A41">
                  <IconButton onClick={() => handleDelete(hashtag.id)}>
                    <DeleteForeverOutlinedIcon style={{ color: 'red' }} />
                  </IconButton>
                </ActionButtonBox>
              </ActionBox>
            )}
          </React.Fragment>
        ))}
      </List>
    </CustomDrawer>
  );
};

export default HashtagDrawer;
