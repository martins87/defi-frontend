import { createMuiTheme } from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const customBreakpointValues = {
  values: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
}

const breakpoints = createBreakpoints({ ...customBreakpointValues })


const secondaryRed = '#AD5252'

const primaryYellowDark = '#F5E39B'


const secondaryGreen = "#5EB872";
const primaryBakcground = "#FFFFFF";



const primaryText = "#FFFFFF";
const secondaryText = "#A4A4A4"

const secondaryOrange = "#FE5F49"

const spacing = 8;

export const muiTheme = createMuiTheme({
  spacing: spacing,
  palette: {
    background:{
      default: '#121212',
      paper: '#1B1B1B'
    },
    primary: {
      main: primaryYellowDark,
    },
    secondary: {
      main: '#ffffff',
      contrastText: secondaryText,
    },
    error: {
      main: "#ff6666",
    },
    success: {
      main: secondaryGreen,
    },
    text: {
      primary: primaryText,
      secondary: "#FFFFFF",
    },
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 1)",
      hoverOpacity: 1,
      selected: "rgba(255, 255, 255, 1)",
      selectedOpacity: 1,
      disabled: "rgba(255, 255, 255, 1)",
      disabledBackground: "rgba(255, 255, 255, 0.25)",
      disabledOpacity: 0.25,
      focus: "rgba(255, 255, 255, 1)",
      focusOpacity: 1,
      activatedOpacity: 1,
    },
  },
  typography: {
    fontFamily: "Avenir",
    allVariants: { color: primaryText, fontWeight: 500, letterSpacing: 1 },
  },
  shape: {
    borderRadius: 0,
  },
  overrides: {
    MuiOutlinedInput:{
      input: {
        textAlign: 'center',
        color: 'white',
        fontSize: '1rem',
        padding: spacing * 4,
        caretColor: secondaryOrange,
      },
      notchedOutline:{
        border:'none'
      },
      root:{
        height: 45,
        background: '#3E3E3E',
        borderRadius:10,
      },
      adornedEnd: {
        [breakpoints.down('xs')]: {
          paddingRight: spacing,
        },
      },
      adornedStart: {
        [breakpoints.down('xs')]: {
          padding:spacing,
        },
      }
    },
    MuiCircularProgress:{
      circle: {
        color: secondaryOrange
      }
    },
    MuiTypography: {
      body1: {
        fontSize: "1rem"
      },
      body2: {
        fontSize: "0.875rem",
      },
      h3: {
        fontSize: "2.25rem",
      },
      h6: {
        fontSize: "1.125rem",
      },
    },
    MuiBackdrop: {
      root:{
        background: 'linear-gradient(0deg, rgba(18, 18, 18, 0.5), rgba(18, 18, 18, 0.5))',
        backdropFilter: 'blur(80px)'
      }
    },
    MuiDivider:{
      root: {
        backgroundColor: secondaryOrange
      }
    },
    MuiButton: {
      root: {
        backgroundColor: '#323232',
        borderRadius: 10,
        textTransform: "none",
        "&$disabled": {
          opacity: "60%",
        },
        '&:hover': {
          backgroundColor: '#35363A',
        },
        width: 266,
        height: 50,
        color: '#ffffff',
        
      },
      label: {
        fontSize: "1.125rem",
        letterSpacing: 1
      },
      text:{
        padding: `0 ${spacing * 3}px`
      },
      sizeSmall: {
        height: 'fit-content',
        width: 'fit-content',
      },
      sizeLarge: {
        background: secondaryRed,
        width: 420,
        height: 50,
        textTransform: "none",
        "&$disabled": {
          opacity: "60%",
        },
      },
      outlined: {
        background: primaryBakcground,
        
        color: `${primaryText} !important`,
        //border: '2px solid linear-gradient(87.17deg, #F3BA7C 0%, #EC407C 100%)',
        //borderImageSource: 'linear-gradient(87.17deg, #F3BA7C 0%, #EC407C 100%)',
        height: 50,
        //borderRadius: 4,
        border: 'solid 2px transparent', /* !importanté */
        textTransform: "none",
        position: 'relative',
        "&$disabled": {
          opacity: "60%",
        },
        '&:hover': {
          background: secondaryRed,
          border: 0,
          color: primaryText,
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0, 
          bottom: 0, 
          left: 0,
          zIndex: -1,
          margin: -2, /* !importanté */
          borderRadius: 'inherit', /* !importanté */
          background: 'linear-gradient(87.17deg, #F3BA7C 0%, #EC407C 100%)'
        }
      }
    },
    MuiIconButton: {
      root: {
        color: '#A0A0A0',
        "&:hover": {
          backgroundColor: "transparent !important",
          color: `#FFFFFF !important`,
        },
        transition: "0.3s",
      },
    },
    MuiLink: {
      root: {
        "&:hover": {
          background:
            "linear-gradient(243.24deg, #EC407C 2.2%, #F3BA7C 96.73%)",
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          opacity: 1,
        },
        fontFamily: "Playfair Display",
        transition: "0.3s",
      },
    },
    MuiSnackbar: {
      root: {
        background: '#AD5252',
        color: '#ffffff'
      },
    },
    MuiTabs: {
      flexContainer: {
        justifyContent: 'space-evenly'
      }
    },
    MuiSlider:{

      root: {
        color: secondaryOrange
      },
      valueLabel: {
        color: secondaryOrange,
        //backgroundColor
      }
    },
    MuiTab: {
      root: {
        maxWidth: 'unset',
        "&$selected": {
          backgroundColor: primaryYellowDark,
          color: secondaryRed
        }
      },
      
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: primaryYellowDark,
        color: secondaryRed,
        fontSize: '0.8rem',
        padding: spacing*2
      }
    }
  },
  props: {
    MuiPaper: {
      color: "primary",
      elevation: 0,
    },
    MuiLink: {
      underline: "none",
    },
    MuiDialog: {
      PaperProps: {
        elevation: 0
      }
    }
  },
});
