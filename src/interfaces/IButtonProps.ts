import { SvgIconComponent } from '@mui/icons-material';

export interface ButtonProps {
  label: string;
  Icon?: SvgIconComponent;
  onClick: () => void;
}
