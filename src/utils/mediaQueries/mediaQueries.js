// mediaQueries.js
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const useMediaQueries = () => {
    const getTheme = useTheme();

    //  for mobile first approach will use this media query variable

    const theme_Xs = useMediaQuery(getTheme.breakpoints.up('xs')); // From extra-small screens to all large screens
    const theme_Sm = useMediaQuery(getTheme.breakpoints.up('sm')); // From small screens to all large screens
    const theme_Md = useMediaQuery(getTheme.breakpoints.up('md')); // From medium screens to all large screens
    const theme_Lg = useMediaQuery(getTheme.breakpoints.up('lg')); // From large screens to all large screens
    const theme_Xl = useMediaQuery(getTheme.breakpoints.up('xl')); // From extra-large screens to all large screens

    //   for desktop first approach will use this media query variable

    const isXs = useMediaQuery(getTheme.breakpoints.down('xs')); // For extra-small screens
    const isSm = useMediaQuery(getTheme.breakpoints.down('sm')); // For small screens
    const isMd = useMediaQuery(getTheme.breakpoints.down('md')); // For medium screens
    const isLg = useMediaQuery(getTheme.breakpoints.down('lg')); // For large screens


    const isIPadPortrait = useMediaQuery('(min-width:768px) and (max-width:1024px) and (orientation:portrait)'); // For iPad portrait mode
    const isIPadLandscape = useMediaQuery('(min-width:768px) and (max-width:1024px) and (orientation:landscape)'); // For iPad landscape mode

    return {getTheme, theme_Xs, theme_Sm, theme_Md, theme_Lg, theme_Xl, isXs, isSm, isMd, isLg, isIPadPortrait, isIPadLandscape };
};

export default useMediaQueries;