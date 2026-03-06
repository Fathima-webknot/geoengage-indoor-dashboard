import { Box, Typography, Button, SvgIconProps } from '@mui/material';
import { ReactElement } from 'react';

/**
 * EmptyState Component Props
 */
interface EmptyStateProps {
  /**
   * Icon to display (MUI Icon component)
   */
  icon: ReactElement<SvgIconProps>;
  
  /**
   * Title text
   */
  title: string;
  
  /**
   * Description text
   */
  description: string;
  
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  
  /**
   * Optional secondary action
   */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * EmptyState Component
 * Reusable component for showing empty states with friendly messages
 */
export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        minHeight: '400px',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          mb: 3,
          color: 'text.disabled',
          '& svg': {
            fontSize: '80px',
            opacity: 0.5,
          },
        }}
      >
        {icon}
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 1,
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          maxWidth: '500px',
          mb: 4,
        }}
      >
        {description}
      </Typography>

      {/* Actions */}
      {(action || secondaryAction) && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {action && (
            <Button
              variant="contained"
              size="large"
              onClick={action.onClick}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {action.label}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="outlined"
              size="large"
              onClick={secondaryAction.onClick}
              sx={{
                px: 4,
                py: 1.5,
              }}
            >
              {secondaryAction.label}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};
