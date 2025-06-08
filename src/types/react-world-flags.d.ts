declare module 'react-world-flags' {
  import { FC } from 'react';
  
  interface WorldFlagProps {
    code: string;
    height?: string | number;
    width?: string | number;
    className?: string;
    style?: React.CSSProperties;
  }

  const WorldFlag: FC<WorldFlagProps>;
  export default WorldFlag;
} 